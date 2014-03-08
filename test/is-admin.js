const sinon = require('sinon');
const assert = require('better-assert');
const equal = require('deep-eql');
const inspect = require('util').inspect;
const format = require('util').format;
const debug = false;
const log = debug ? console.log.bind(console) : function () {
    };
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
    log(format('isIdentifiedAs(%s, %s)', nickname, accountame));
    var result = false;
    if (nickname === 'bob' && accountame === 'boblocke') {
        result = true;
    } else if (nickname === 'joe' && accountame === 'joebrown') {
        result = true;
    }
    log('isIdentifiedAs Result: ' + result);
    return Promise.resolve(result);
};
const imports = { user: { isIdentifiedAs: isIdentifiedAs } };
describe('is-admin', function () {
    var tennu, isAdmin;
    beforeEach(function () {
        log();
        tennu = {
            debug: log,
            info: log,
            note: log,
            warn: log,
            error: log
        };
        tennu.debug();
    });
    it('is of the \'admin\' role', function () {
        assert(AdminModule.role === 'admin');
    });
    describe('with no admins', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is false for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('with everybody-matches config', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{}];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is true for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('with nobody-matches config', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{
                        nickname: '^nobody$',
                        username: '^nobody$',
                        hostname: '^nobody$',
                        identifedas: 'nobody'
                    }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is false for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('with nobody-matches and everybody matches config', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    {
                        nickname: '^nobody$',
                        username: '^nobody$',
                        hostname: '^nobody$',
                        identifedas: 'nobody'
                    },
                    {}
                ];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is true for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('matching the nick "joe"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{ nickname: '^joe$' }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is true for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('matching the username "green"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{ username: '^green$' }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is false for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('matching the usernames "green" and "brown"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{ username: '^(green|brown)$' }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is true for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('matching the hostname "a"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{ hostname: '^a$' }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is true for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('matches bob', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{
                        nickname: '^bob$',
                        username: '^locke$',
                        hostname: '^z$'
                    }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is false for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('is identifiedas "boblocke"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [{ identifiedas: 'boblocke' }];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is false for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
    });
    describe('is identifiedas "boblocke" or "joebrown"', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [
                    { identifiedas: 'boblocke' },
                    {
                        username: '^brown$',
                        identifiedas: 'joebrown'
                    }
                ];
            };
            isAdmin = AdminModule.init(tennu, imports).exports.isAdmin;
        });
        it('is true for $name', function (done) {
            isAdmin(joeb).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(joeg).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(annb).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is false for $name', function (done) {
            isAdmin(anng).then(function (isAdmin$2) {
                assert(!isAdmin$2);
            }).then(done).done();
        });
        ;
        it('is true for $name', function (done) {
            isAdmin(bob).then(function (isAdmin$2) {
                assert(isAdmin$2);
            }).then(done).done();
        });
        ;
    });
});