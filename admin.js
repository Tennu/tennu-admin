var format = require('util').format;
var inspect = require('util').inspect;
var Q = require('q');
var help = require('./help.json');
var anyRegex = /.*/;
var names = ['nickname', 'username', 'hostname'];
// Hostmask :: {nickname: String, username: String, hostname: String}
// Response :: tennu$Response
// Admin :: {nickname: RegExp, username: RegExp, hostname: RegExp, identifiedas: String?}

function notHasIdentifiedasProperty (admin) {
    return !admin.hasOwnProperty('identifiedas');
}

module.exports = function (client) {
    var admins;

    // tennu$Client! -> {nickname: String?, username: String?, hostname: String?, identifiedas: String?} -> Admin
    function regexify (admin) {
        client.notice(format("Adding admin: %j", admin));

        names.forEach(function (name) {
            if (admin.hasOwnProperty(name)) {
                admin[name] = new RegExp(admin[name], 'i');
            } else {
                admin[name] = anyRegex;
            }
        });
    }

    // tennu$Client! -> [Admin] throws Error
    function initalizeAdmins () {
        var admins = client.config('admins').slice();

        if (!Array.isArray(admins)) {
            var errormsg = "'admins' property in configuration must be an array";
            client.error(errormsg);
            throw new Error(errormsg);
        }

        admins.forEach(regexify);
        return admins;
    }

    // tennu$Client! -> Hostmask -> Admin -> boolean
    function checkHostmask (hostmask, admin) {
        client.debug(format("Admin object: %s", inspect(admin)));

        return names.some(function (name) {
            return admin[name].test(hostmask[name]);
        });
    }

    // (!) -> Hostmask -> [Admin] -> [Admin]
    function validHostmask (hostmask, admins) {
        return admins.filter(function (admin) {
            return checkHostmask(hostmask, admin);
        });
    }

    // Module Initialization
    initalizeAdmins();

    // Hostmask -> Promise boolean
    var isAdmin = function (hostmask) {
        var isIdentifiedAs = admin_module.imports.isIdentifiedAs;

        return Q(admins).then(function (admins) {
            var hostmask_passed = admins.filter(function (admin) {
                return checkHostmask(hostmask, admin);
            });

            if (hostmask_passed.some(notHasIdentifiedasProperty)) {
                return true;
            }

            return (function recur () {
                if (hostmask_passed.length === 0) {
                    return false;
                }

                return Q(hostmask_passed.pop())
                .get('identifiedas')
                .then(function (accountname) {
                    if (isIdentifiedAs(hostmask.nickname, accountname)) {
                        return true;
                    } else {
                        return recur();
                    }
                });
            });
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
    }

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
                if (command.args[0]) {
                    client.notice(format("Parting %s - requested by %s", command.args[0], command.prefix));
                    client.part(command.args[0]);
                } else if (!command.isQuery) {
                    client.notice(format("Parting %s - requested by %s", command.channel, command.prefix));
                    client.part(command.channel);
                } else {
                    return this.exports.help.join;
                }
            }),

            "!quit" : requiresAdmin(function (command) {
                client.notice(format("Quitting network - requested by %s", command.prefix));
                client.quit();
            })
        }
    };

    return admin_module;
};