var sinon = require('sinon');
var assert = require('better-assert');
var equal = require('deep-eql');
var inspect = require('util').inspect;
var format = require('util').format;

var admin_module = require('../admin.js');
var Q = require('q');
var debug = false;
var logfn = debug ? console.log.bind(console) : function () {};

var hostmask = function (hm) {
    var parts = hm.split(/!|@/g);

    return {
        nickname: parts[0],
        username: parts[1],
        hostname: parts[2]
    };
};

var joeb = hostmask('joe!brown@a');
var joeg = hostmask('joe!green@b');
var annb = hostmask('ann!brown@a');
var anng = hostmask('ann!green@c');
var bob = hostmask('bob!locke@z');

var isIdentifiedAs = function (nickname, accountame) {
    logfn(format("isIdentifiedAs(%s, %s)", nickname, accountame));
    var result = false;

    if (nickname === 'bob' && accountame === 'boblocke') {
        result = true;
    } else if (nickname === 'joe' && accountame === 'joebrown') {
        result = true;
    }

    logfn("Result: " + result);
    return Q(result);
};

// (tennu$client -> tennu-modules$Module)! -> tennu$client -> tennu-modules$Module
var loadWith = function (tennu) {
    logfn("Loading Admin module.");
    var module = admin_module(tennu);
    module.imports = {};
    module.imports.isIdentifiedAs = isIdentifiedAs;
    return module;
};

describe('is-admin', function () {
    var tennu, isAdmin

    beforeEach(function () {
        tennu = {
            debug: logfn,
            info: logfn,
            notice: logfn,
            warn: logfn,
            error: logfn
        };

        tennu.debug();
    });

    describe('with no admins', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is false for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('with everybody-matches config', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{}];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is true for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('with nobody-matches config', function () {
        beforeEach(function () {
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

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is false for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('with nobody-matches and everybody matches config', function () {
        beforeEach(function () {
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

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is true for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('matching the nick "joe"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        nickname: "^joe$"
                    }
                ];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is true for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('matching the username "green"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        username: "^green$"
                    }
                ];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is false for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is true for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is true for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('matching the usernames "green" and "brown"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        username: "^(green|brown)$"
                    }
                ];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is true for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is true for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('matching the hostname "a"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        hostname: "^a$"
                    }
                ];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is true for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is true for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('matches bob', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        nickname: "^bob$",
                        username: "^locke$",
                        hostname: "^z$"
                    }
                ];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is false for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is true for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('is identifiedas "boblocke"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        identifiedas: "boblocke"
                    }
                ];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is false for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is true for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });
    });

    describe('is identifiedas "boblocke" or "joebrown"', function () {
        beforeEach(function () {
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

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it('is true for joeb', function (done) {
            isAdmin(joeb)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeg)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(annb)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(anng)
            .then(function (isAdmin) { assert(!isAdmin); })
            .then(done)
            .done();
        });

        it('is true for bob', function (done) {
            isAdmin(bob)
            .then(function (isAdmin) { assert(isAdmin); })
            .then(done)
            .done();
        });
    });
});