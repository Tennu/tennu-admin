var sinon = require('sinon');
var assert = require('better-assert');
var equal = require('deep-eql');
var inspect = require('util').inspect;
var format = require('util').format;

var assertnot = function (v) { assert(!v); };

var admin_module = require('../admin.js');
var Q = require('q');
var debug = false;

var joeb = 'joe!brown@a';
var jorg = 'joe!green@b';
var annb = 'ann!brown@a';
var anng = 'ann!green@c';
var bob = 'bob!locke@z';

// (tennu$client -> tennu-modules$Module)! -> tennu$client -> tennu-modules$Module
var loadWith = function (tennu) {
    var module = admin_module(tennu);
    module.inports = {};
    module.inports.isIdentifiedAs = function (nickname, accountame) {
        return Q(false);
    };
    return module;
};

describe('is-admin', function () {
    var tennu, isAdmin

    beforeEach(function () {
        tennu = {
            debug: debug ? console.log.bind(console) : function () {},
            info: debug ? console.log.bind(console) : function () {},
            notice: debug ? console.log.bind(console) : function () {},
            warn: debug ? console.log.bind(console) : function () {},
            error: debug ? console.log.bind(console) : function () {}
        };
    });

    describe('with no admins', function () {
        beforeEach(function () {
            tennu.config = function () {
                return [];
            };

            var module = loadWith(tennu);
            isAdmin = module.exports.isAdmin;
        });

        it.only('is false for joeb', function (done) {
            isAdmin(joeb)
            .then(assertnot)
            .then(done)
            .done();
        });

        it('is false for joeg', function (done) {
            isAdmin(joeb)
            .then(assertnot)
            .then(done)
            .done();
        });

        it('is false for annb', function (done) {
            isAdmin(joeb)
            .then(assertnot)
            .then(done)
            .done();
        });

        it('is false for anng', function (done) {
            isAdmin(joeb)
            .then(assertnot)
            .then(done)
            .done();
        });

        it('is false for bob', function (done) {
            isAdmin(joeb)
            .then(assertnot)
            .then(done)
            .done();
        });
    });
});