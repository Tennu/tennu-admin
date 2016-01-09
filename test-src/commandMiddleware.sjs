const sinon = require("sinon");
const assert = require("better-assert");
const equal = require("deep-eql");
const inspect = require("util").inspect;
const format = require("util").format;

const debug = false;
const log = debug ? console.log.bind(console) : function () {};

const AdminPlugin = require("../plugin.js");

const allowed = "allowed";
const alsoAllowed = "also-allowed";
const disallowed = "disallowed";

const replySuccess = function () {
    return "Success";
};

const isIdentifiedAs = function (nickname, authname) {
    return nickname === authname;
};

const imports = {
    user: {
        isIdentifiedAs: isIdentifiedAs
    }
};

const tennu = function (deniedResponse) {
    return {
        config: function (value) {
            return {
                admins: [
                    {"nickname": "^allowed$", "isIdentifiedAs": "allowed"},
                    {"nickname": "^also-allowed$"}
                ],

                "admin-commands": ["test"],

                "admin-failed-attempt-response": deniedResponse

            }[value];
        },

        debug: log,
        info: log,
        note: log,
        warn: log,
        error: log,

        toString: function () { return "[Object Tennu]"; }
    };
};

const makeCommand = function (nickname) {
    return {
        params: ["PRIVMSG", "#channel", "!test"],
        args: [],
        command: "test",
        nickname: nickname,
        hostmask: {
            nickname: nickname,
            username: "username",
            hostname: "host"
        },
        channel: "#channel"
    }
};

describe "Admin command middleware" {
    it "returns the command if the user is allowed to use it" {
        const instance = AdminPlugin.init(tennu(undefined), imports);
        const middleware = instance.commandMiddleware;
        const command = makeCommand(allowed);

        return middleware(command).then(function (result) {
            assert(result === command);
        });
    }

    it "returns the configured denied response if the user is not allowed" {
        const instance = AdminPlugin.init(tennu("No"), imports);
        const middleware = instance.commandMiddleware;
        const command = makeCommand(disallowed);

        return middleware(command).then(function (result) {
            assert(result === "No");
        });
    }

    it "returns the default denied response if the user is not allowed and config isn't set" {
        const instance = AdminPlugin.init(tennu(undefined), imports);
        const middleware = instance.commandMiddleware;
        const command = makeCommand(disallowed);

        return middleware(command).then(function (result) {
            assert(result === "Permission denied.");
        });
    }
}