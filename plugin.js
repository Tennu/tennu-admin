const format = require('util').format;
const inspect = require('util').inspect;
const Promise = require('bluebird');
const anyRegex = /.*/;
const names = ['nickname', 'username', 'hostname'];
const adminKeys = names.concat('identifiedas');
// Hostmask :: {nickname: String, username: String, hostname: String}
// Response :: tennu$Response
// Admin :: {nickname: RegExp, username: RegExp, hostname: RegExp, identifiedas: String?}

function notHasIdentifiedasProperty (admin) {
    return !admin['identifiedas'];
}

function cloneOnlyAdminKeys (object) {
    const clone = {};

    adminKeys.forEach(function (key) {
        clone[key] = object[key];
    });

    return clone;
}

module.exports = AdminModule = {
    init: function (client, imports) {
        const isIdentifiedAs = imports.user.isIdentifiedAs;
        var admins;

        // tennu.Client! -> {nickname: String?, username: String?, hostname: String?, identifiedas: String?} -> Admin
        function regexify (admin) {
            client.note('PluginAdmin', format('Adding admin: %j', admin));

            names.forEach(function (name) {
                if (admin[name]) {
                    admin[name] = new RegExp(admin[name], 'i');
                } else {
                    admin[name] = anyRegex;
                }
            });

            return admin;
        }

        // tennu.Client! -> [Admin] throws Error
        function initalizeAdmins () {
            const admins = client.config('admins');

            if (!Array.isArray(admins)) {
                const errormsg = '\'admins\' property in configuration must be an array';
                client.error(errormsg);
                throw new Error(errormsg);
            }

            return admins.map(cloneOnlyAdminKeys).map(regexify);
        }

        // tennu.Client! -> Hostmask -> Admin -> boolean
        function checkHostmask (hostmask, admin) {
            return names.every(function (name) {
                const result = admin[name].test(hostmask[name]);

                client.debug('PluginAdmin', format('%s: %s, %s (%s)',
                    name, hostmask[name], admin[name], result));

                return admin[name].test(hostmask[name]);
            });
        }

        // Module Initialization
        admins = initalizeAdmins();

        // Hostmask -> Promise boolean
        const isAdmin = function (hostmask) {
            return Promise.try(function () {
                const hostmask_passed = admins.filter(function (admin) {
                    return checkHostmask(hostmask, admin);
                });

                if (hostmask_passed.some(notHasIdentifiedasProperty)) {
                    client.debug('PluginAdmin', 'Admin object w/o identifiedas property (true)');
                    return true;
                }

                client.debug('PluginAdmin', 'Admin object w/o identifiedas property (false)');

                return (function recur () {
                    if (hostmask_passed.length === 0) {
                        client.debug('PluginAdmin', 'User passes an identifiedas check (false)');
                        return false;
                    }

                    return Promise.try(function () {
                        const hostmask = hostmask_passed.pop()
                        return hostmask.identifiedas;
                    })
                    .then(function (accountname) {
                        return isIdentifiedAs(hostmask.nickname, accountname);
                    })
                    .then(function (isIdentifiedAs) {
                        if (isIdentifiedAs) {
                            client.debug('PluginAdmin', 'User passes an identifiedas check (true)');
                            return true;
                        } else {
                            return recur();
                        }
                    });
                }());
            });
        };

        // (Command -> Response) -> (Command -> Response)
        const requiresAdmin = function (fn) {
            return function (command) {
                return isAdmin(command.hostmask)
                .then(function (isAdmin) {
                    if (isAdmin) {
                        return fn(command);
                    } else {
                        return 'Permission denied.';
                    }
                });
            };
        };

        return {
            exports: {
                isAdmin: isAdmin,
                requiresAdmin: requiresAdmin
            }
        };
    },
    name: 'admin',
    role: 'admin',
    requires: ['user']
};
