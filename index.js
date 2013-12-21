return function (tennu) {
    try {
        var admins = tennu.config('admins').forEach(function (admin) {
            // Turn properties into RegExp because JSON doesn't have RegExp

            if (admin.nick) {
                admin.nick = new RegExp(admin.nick);
            }

            if (admin.user) {
                admin.user = new RegExp(admin.user);
            }

            if (admin.host) {
                admin.host = new RegExp(admin.host);
            }
        });
    catch (e) {
        // admins property doesn't exist or isn't an array.
        throw new Error("admins property in configuration must be an array")
    }

    var isAdmin = function (hostmask) {
        return admins.some(function (admin) {
            if (admin.nick && !admin.test(hostmask.nick)) {
                return false;
            }

            if (admin.user && !admin.user(hostmask.user)) {
                return false;
            }

            if (admin.host && !admin.host(hostmask.host)) {
                return false;
            }

            if (admin.identified && !tennu_module.user.isIdentified(hostmask.nick)) {
                return false;
            }

            return true;
        });
    };

    var requireAdmin = function (fn) {
        return function (command) {
            if (isAdmin(command.hostmask)) {
                fn(command);
            } else {
                tennu.warn("Invalid admin function usage by " + command.hostmask);
                return "Permission denied.";
            }
        }
    }

    var help = require('./help.json');

    var tennu_module = {
        dependencies: ['user'],
        exports: {
            help: help,
            isAdmin: isAdmin,
            requireAdmin: requireAdmin
        },
        handlers: {
            "!join" : requiresAdmin(function (command) {
                if (command.args[0]) {
                    tennu.join(command.args[0]);
                }

            }),

            "!part" : requiresAdmin(function (command) {
                if (command.args[0] !== '') {
                    tennu.part(command.args[0]);
                } else if (!command.isQuery) {
                    tennu.part(command.channel);
                }

            }),

            "!quit" : requiresAdmin(function (command) {
                tennu.quit();
            })
        }
    };

    return tennu_module;
};