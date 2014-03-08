const sinon = require('sinon');
const assert = require('better-assert');
const equal = require('deep-eql');
const inspect = require('util').inspect;
const format = require('util').format;
const debug = false;
const log = debug ? console.log.bind(console) : function () {
    };
const AdminPlugin = require('../plugin.js');
const allowed = 'allowed';
const alsoAllowed = 'also-allowed';
const disallowed = 'disallowed';
const replySuccess = function () {
    return 'Success';
};
const isIdentifiedAs = function (nickname, authname) {
    return nickname === authname;
};
const imports = { user: { isIdentifiedAs: isIdentifiedAs } };
const tennu = {
        config: function (value) {
            return [
                {
                    'nickname': '^allowed$',
                    'isIdentifiedAs': 'allowed'
                },
                { 'nickname': '^also-allowed$' }
            ];
        },
        debug: log,
        info: log,
        note: log,
        warn: log,
        error: log,
        toString: function () {
            return '[Object Tennu]';
        }
    };
const makeCommand = function (nickname) {
    return {
        params: [
            'PRIVMSG',
            '#channel',
            '!test'
        ],
        args: [],
        command: 'test',
        nickname: nickname,
        hostmask: {
            nickname: nickname,
            username: 'username',
            hostname: 'host'
        },
        channel: '#channel'
    };
};
describe('requiresAdmin', function () {
    var instance, requiresAdmin, adminOnlySuccess;
    beforeEach(function () {
        instance = AdminPlugin.init(tennu, imports);
        requiresAdmin = instance.exports.requiresAdmin;
        adminOnlySuccess = requiresAdmin(replySuccess);
    });
    it('wraps a handler', function () {
        assert(typeof adminOnlySuccess === 'function');
    });
    it('disallows non-admins from using the command', function (done) {
        const command = makeCommand(disallowed);
        adminOnlySuccess(command).then(function (retval) {
            assert(retval === 'Permission denied.');
        }).catch(function (err) {
            return err;
        }).then(done).done();
    });
    it('allows admins (w/o isIdentifiedAs check)', function (done) {
        const command = makeCommand(alsoAllowed);
        adminOnlySuccess(command).then(function (retval) {
            assert(retval === 'Success');
        }).catch(function (err) {
            return err;
        }).then(done).done();
    });
    it('allows admins (w/ isIdentifiedAs check)', function (done) {
        const command = makeCommand(allowed);
        adminOnlySuccess(command).then(function (retval) {
            assert(retval === 'Success');
        }).catch(function (err) {
            return err;
        }).then(done).done();
    });
});