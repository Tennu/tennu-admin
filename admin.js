var format = require('util').format;
var inspect = require('util').inspect;
var Q = require('q');
var help = require('./help.json');
var anyRegex = /.*/;
var names = ['nickname', 'username', 'hostname'];
var adminKeys = names.concat('identifiedas');
// Hostmask :: {nickname: String, username: String, hostname: String}
// Response :: tennu$Response
// Admin :: {nickname: RegExp, username: RegExp, hostname: RegExp, identifiedas: String?}

function notHasIdentifiedasProperty (admin) {
    return !admin['identifiedas'];
}

function cloneOnlyAdminKeys (object) {
    var clone = {};

    adminKeys.forEach(function (key) {
        clone[key] = object[key];
    });

    return clone;
}

module.exports = function (client) {
    var admins;

    // tennu$Client! -> {nickname: String?, username: String?, hostname: String?, identifiedas: String?} -> Admin
    function regexify (admin) {
        client.notice(format("Adding admin: %j", admin));

        names.forEach(function (name) {
            if (admin[name]) {
                admin[name] = new RegExp(admin[name], 'i');
            } else {
                admin[name] = anyRegex;
            }
        });

        return admin;
    }

    // tennu$Client! -> [Admin] throws Error
    function initalizeAdmins () {
        var admins = client.config('admins');

        if (!Array.isArray(admins)) {
            var errormsg = "'admins' property in configuration must be an array";
            client.error(errormsg);
            throw new Error(errormsg);
        }

        return admins.map(cloneOnlyAdminKeys).map(regexify);
    }

    // tennu$Client! -> Hostmask -> Admin -> boolean
    function checkHostmask (hostmask, admin) {
        return names.every(function (name) {
            var result = admin[name].test(hostmask[name]);

            client.debug(format("%s: %s, %s (%s)",
                name, hostmask[name], admin[name], result));

            return admin[name].test(hostmask[name]);
        });
    }

    // Module Initialization
    admins = initalizeAdmins();

    // Hostmask -> Promise boolean
    var isAdmin = function (hostmask) {
        var isIdentifiedAs = admin_module.imports.isIdentifiedAs;

        return Q(admins).then(function (admins) {
            var hostmask_passed = admins.filter(function (admin) {
                return checkHostmask(hostmask, admin);
            });

            client.debug("isAdmin info!");
            client.debug(hostmask_passed);

            if (hostmask_passed.some(notHasIdentifiedasProperty)) {
                client.debug("Some filtered admin doesn't have identifiedas property.")
                return true;
            }

            return (function recur () {
                if (hostmask_passed.length === 0) {
                    client.debug("Out of filtered hostmasks.");
                    return false;
                }

                return Q(hostmask_passed.pop())
                .get('identifiedas')
                .then(function (accountname) {
                    return isIdentifiedAs(hostmask.nickname, accountname)
                    .then(function (isIdentifiedAs) {
                        if (isIdentifiedAs) {
                            client.debug("nickname is identified as accountname");
                            return true;  
                        } else {
                            client.debug("Recurring");
                            return recur();
                        }
                    });
                });
            }());
        });
    };

    // (Command -> Response) -> Response
    var requiresAdmin = function (fn) {
        return function (command) {
            if (isAdmin(command.hostmask)) {
                return fn(command);
            } else {
                client.warn("Invalid admin function usage by " + command.prefix);
                return "Permission denied.";
            }
        }
    };

    var admin_module = {
        dependencies: ['user'],
        exports: {
            help: help,
            isAdmin: isAdmin,
            requiresAdmin: requiresAdmin
        },
        handlers: {
            "!join" : requiresAdmin(function (command) {
                if (command.args[0]) {
                    client.notice(format("Joining %s - requested by %s", command.channel, command.prefix));
                    client.join(command.args[0]);
                }

            }),

            "!part" : requiresAdmin(function (command) {
                var channel;

                if (command.args[0]) {
                    channel = command.args[0];
                } else if (!command.isQuery) {
                    channel = command.channel;
                } else {
                    return this.exports.help.join;
                }

                client.notice(format("Parting %s - requested by %s", channel, command.prefix));
                client.part(command.args[0]);
            }),

            "!quit" : requiresAdmin(function (command) {
                client.notice(format("Quitting network - requested by %s", command.prefix));
                client.quit();
            })
        }
    };

    return admin_module;
};