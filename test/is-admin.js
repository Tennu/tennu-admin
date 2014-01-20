const sinon$374 = require('sinon');
const assert$375 = require('better-assert');
const equal$376 = require('deep-eql');
const inspect$377 = require('util').inspect;
const format$378 = require('util').format;
const debug$379 = false;
const log$380 = debug$379 ? console.log.bind(console) : function () {
    };
const AdminModule$381 = require('../plugin.js');
const Promise$382 = require('bluebird');
const hostmask$383 = function (hm) {
    const parts = hm.split(/!|@/g);
    return {
        nickname: parts[0],
        username: parts[1],
        hostname: parts[2]
    };
};
const joeb$384 = hostmask$383('joe!brown@a');
const joeg$385 = hostmask$383('joe!green@b');
const annb$386 = hostmask$383('ann!brown@a');
const anng$387 = hostmask$383('ann!green@c');
const bob$388 = hostmask$383('bob!locke@z');
const isIdentifiedAs$389 = function (nickname, accountame) {
    log$380(format$378('isIdentifiedAs(%s, %s)', nickname, accountame));
    var result = false;
    if (nickname === 'bob' && accountame === 'boblocke') {
        result = true;
    } else if (nickname === 'joe' && accountame === 'joebrown') {
        result = true;
    }
    log$380('isIdentifiedAs Result: ' + result);
    return Promise$382.resolve(result);
};
const imports$390 = { user: { isIdentifiedAs: isIdentifiedAs$389 } };
describe('is-admin', function () {
    var tennu$392, isAdmin$393;
    beforeEach(function () {
        log$380();
        tennu$392 = {
            debug: log$380,
            info: log$380,
            notice: log$380,
            warn: log$380,
            error: log$380
        };
        tennu$392.debug();
    });
    it('is of the \'admin\' role', function () {
        assert$375(AdminModule$381.role === 'admin');
    });
    describe('with no admins', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is false for $name', function (done$468) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$468).done();
        });
        ;
        it('is false for $name', function (done$470) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$470).done();
        });
        ;
        it('is false for $name', function (done$472) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$472).done();
        });
        ;
        it('is false for $name', function (done$474) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$474).done();
        });
        ;
        it('is false for $name', function (done$476) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$476).done();
        });
        ;
    });
    describe('with everybody-matches config', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{}];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is true for $name', function (done$489) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$489).done();
        });
        ;
        it('is true for $name', function (done$491) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$491).done();
        });
        ;
        it('is true for $name', function (done$493) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$493).done();
        });
        ;
        it('is true for $name', function (done$495) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$495).done();
        });
        ;
        it('is true for $name', function (done$497) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$497).done();
        });
        ;
    });
    describe('with nobody-matches config', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{
                        nickname: '^nobody$',
                        username: '^nobody$',
                        hostname: '^nobody$',
                        identifedas: 'nobody'
                    }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is false for $name', function (done$510) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$510).done();
        });
        ;
        it('is false for $name', function (done$512) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$512).done();
        });
        ;
        it('is false for $name', function (done$514) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$514).done();
        });
        ;
        it('is false for $name', function (done$516) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$516).done();
        });
        ;
        it('is false for $name', function (done$518) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$518).done();
        });
        ;
    });
    describe('with nobody-matches and everybody matches config', function () {
        beforeEach(function () {
            tennu$392.config = function () {
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
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is true for $name', function (done$531) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$531).done();
        });
        ;
        it('is true for $name', function (done$533) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$533).done();
        });
        ;
        it('is true for $name', function (done$535) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$535).done();
        });
        ;
        it('is true for $name', function (done$537) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$537).done();
        });
        ;
        it('is true for $name', function (done$539) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$539).done();
        });
        ;
    });
    describe('matching the nick "joe"', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{ nickname: '^joe$' }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is true for $name', function (done$552) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$552).done();
        });
        ;
        it('is true for $name', function (done$554) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$554).done();
        });
        ;
        it('is false for $name', function (done$556) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$556).done();
        });
        ;
        it('is false for $name', function (done$558) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$558).done();
        });
        ;
        it('is false for $name', function (done$560) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$560).done();
        });
        ;
    });
    describe('matching the username "green"', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{ username: '^green$' }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is false for $name', function (done$573) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$573).done();
        });
        ;
        it('is true for $name', function (done$575) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$575).done();
        });
        ;
        it('is false for $name', function (done$577) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$577).done();
        });
        ;
        it('is true for $name', function (done$579) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$579).done();
        });
        ;
        it('is false for $name', function (done$581) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$581).done();
        });
        ;
    });
    describe('matching the usernames "green" and "brown"', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{ username: '^(green|brown)$' }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is true for $name', function (done$594) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$594).done();
        });
        ;
        it('is true for $name', function (done$596) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$596).done();
        });
        ;
        it('is true for $name', function (done$598) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$598).done();
        });
        ;
        it('is true for $name', function (done$600) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$600).done();
        });
        ;
        it('is false for $name', function (done$602) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$602).done();
        });
        ;
    });
    describe('matching the hostname "a"', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{ hostname: '^a$' }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is true for $name', function (done$615) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$615).done();
        });
        ;
        it('is false for $name', function (done$617) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$617).done();
        });
        ;
        it('is true for $name', function (done$619) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$619).done();
        });
        ;
        it('is false for $name', function (done$621) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$621).done();
        });
        ;
        it('is false for $name', function (done$623) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$623).done();
        });
        ;
    });
    describe('matches bob', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{
                        nickname: '^bob$',
                        username: '^locke$',
                        hostname: '^z$'
                    }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is false for $name', function (done$636) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$636).done();
        });
        ;
        it('is false for $name', function (done$638) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$638).done();
        });
        ;
        it('is false for $name', function (done$640) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$640).done();
        });
        ;
        it('is false for $name', function (done$642) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$642).done();
        });
        ;
        it('is true for $name', function (done$644) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$644).done();
        });
        ;
    });
    describe('is identifiedas "boblocke"', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [{ identifiedas: 'boblocke' }];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is false for $name', function (done$657) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$657).done();
        });
        ;
        it('is false for $name', function (done$659) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$659).done();
        });
        ;
        it('is false for $name', function (done$661) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$661).done();
        });
        ;
        it('is false for $name', function (done$663) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$663).done();
        });
        ;
        it('is true for $name', function (done$665) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$665).done();
        });
        ;
    });
    describe('is identifiedas "boblocke" or "joebrown"', function () {
        beforeEach(function () {
            tennu$392.config = function () {
                return [
                    { identifiedas: 'boblocke' },
                    {
                        username: '^brown$',
                        identifiedas: 'joebrown'
                    }
                ];
            };
            isAdmin$393 = AdminModule$381.init(tennu$392, imports$390).exports.isAdmin;
        });
        it('is true for $name', function (done$678) {
            isAdmin$393(joeb$384).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$678).done();
        });
        ;
        it('is false for $name', function (done$680) {
            isAdmin$393(joeg$385).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$680).done();
        });
        ;
        it('is false for $name', function (done$682) {
            isAdmin$393(annb$386).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$682).done();
        });
        ;
        it('is false for $name', function (done$684) {
            isAdmin$393(anng$387).then(function (isAdmin$393) {
                assert$375(!isAdmin$393);
            }).then(done$684).done();
        });
        ;
        it('is true for $name', function (done$686) {
            isAdmin$393(bob$388).then(function (isAdmin$393) {
                assert$375(isAdmin$393);
            }).then(done$686).done();
        });
        ;
    });
});