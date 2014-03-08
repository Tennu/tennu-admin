const sinon = require('sinon');
const assert = require('better-assert');
const equal = require('deep-eql');
const inspect = require('util').inspect;
const format = require('util').format;

const debug = false;
const log = debug ? console.log.bind(console) : function () {};

const AdminModule = require('../plugin.js');
const Promise = require('bluebird');

const hostmask = function (hm) {
    const parts = hm.split(/!|@/g);

    return {
        nickname: parts[0],
        username: parts[1],
        hostname: parts[2]
    };
};

const joeb = hostmask('joe!brown@a');
const joeg = hostmask('joe!green@b');
const annb = hostmask('ann!brown@a');
const anng = hostmask('ann!green@c');
const bob = hostmask('bob!locke@z');

const isIdentifiedAs = function (nickname, accountame) {
    log(format("isIdentifiedAs(%s, %s)", nickname, accountame));
    var result = false;

    if (nickname === 'bob' && accountame === 'boblocke') {
        result = true;
    } else if (nickname === 'joe' && accountame === 'joebrown') {
        result = true;
    }

    log("isIdentifiedAs Result: " + result);
    return Promise.resolve(result);
};

const imports = {
    user: {
        isIdentifiedAs: isIdentifiedAs
    }
};

describe 'is-admin' {
    var tennu, isAdmin

    beforeEach {
        log(/* newline */);

        tennu = {
            debug: log,
            info: log,
            note: log,
            warn: log,
            error: log
        };

        tennu.debug();
    }

    it 'is of the \'admin\' role' {
        assert(AdminModule.role === 'admin');
    }

    /*
    macro __testname => {
        case { _ ($bool) ($name) } => {
            return [makeValue('is ' + $bool + ' for ' + $name), #{}];
        }
    }
    */

    macro truefor {
        rule { $name:ident } => {
            it 'is true for $name' (done) {
                isAdmin($name)
                .then(function (isAdmin) {
                    assert(isAdmin);
                })
                .then(done)
                .done();
            }
        }
    }

    macro falsefor {
        rule { $name:ident } => {
            it 'is false for $name' (done) {
                isAdmin($name)
                .then(function (isAdmin) {
                    assert(!isAdmin);
                })
                .then(done)
                .done();
            }
        }
    }

    describe 'with no admins' {
        beforeEach {
            tennu.config = function () {
                return [];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        falsefor joeb;
        falsefor joeg;
        falsefor annb;
        falsefor anng;
        falsefor bob;
    }

    describe 'with everybody-matches config' {
        beforeEach {
            tennu.config = function () {
                return [{}];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        truefor joeb;
        truefor joeg;
        truefor annb;
        truefor anng;
        truefor bob;
    }

    describe 'with nobody-matches config' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        nickname: "^nobody$",
                        username: "^nobody$",
                        hostname: "^nobody$",
                        identifedas: "nobody"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        falsefor joeb;
        falsefor joeg;
        falsefor annb;
        falsefor anng;
        falsefor bob;
    }

    describe 'with nobody-matches and everybody matches config' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        nickname: "^nobody$",
                        username: "^nobody$",
                        hostname: "^nobody$",
                        identifedas: "nobody"
                    },

                    {}
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        truefor joeb;
        truefor joeg;
        truefor annb;
        truefor anng;
        truefor bob;
    }

    describe 'matching the nick "joe"' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        nickname: "^joe$"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        truefor joeb;
        truefor joeg;
        falsefor annb;
        falsefor anng;
        falsefor bob;
    }

    describe 'matching the username "green"' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        username: "^green$"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        falsefor joeb;
        truefor joeg;
        falsefor annb;
        truefor anng;
        falsefor bob;
    }

    describe 'matching the usernames "green" and "brown"' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        username: "^(green|brown)$"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        truefor joeb;
        truefor joeg;
        truefor annb;
        truefor anng;
        falsefor bob;
    }

    describe 'matching the hostname "a"' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        hostname: "^a$"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        truefor joeb;
        falsefor joeg;
        truefor annb;
        falsefor anng;
        falsefor bob;
    }

    describe 'matches bob' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        nickname: "^bob$",
                        username: "^locke$",
                        hostname: "^z$"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        falsefor joeb;
        falsefor joeg;
        falsefor annb;
        falsefor anng;
        truefor bob;
    }

    describe 'is identifiedas "boblocke"' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        identifiedas: "boblocke"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        falsefor joeb;
        falsefor joeg;
        falsefor annb;
        falsefor anng;
        truefor bob;
    }

    describe 'is identifiedas "boblocke" or "joebrown"' {
        beforeEach {
            tennu.config = function () {
                return [
                    {
                        identifiedas: "boblocke"
                    },

                    {
                        username: "^brown$",
                        identifiedas: "joebrown"
                    }
                ];
            };

            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        }

        truefor joeb;
        falsefor joeg;
        falsefor annb;
        falsefor anng;
        truefor bob;
    }
}