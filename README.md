# Admin Plugin for Tennu

[![Build Status](https://travis-ci.org/Tennu/tennu-admin.png?branch=master)](https://travis-ci.org/Tennu/tennu-admin)

Gives administrative control to a [Tennu](https://github.com/Tennu/tennu) bot.

Depends on Tennu 0.7.2 or higher.

This plugin implements the 'admin' role.

## Installation

`npm install tennu-admin`

## Config

This module add a property to the config object passed to `tennu.Client()`.

### admins property

In the config file, add an 'admins' property which takes a list of objects with the following format:

```javascript
{
    nickname: "^name$",
    username: "^name$",
    hostname: "^your\.hostmask\.isp\.net$"
    identifiedas: "accountname",
}
```

The nickname, username, and hostname fields will be coverted to case-insensitive regular expressions.

A person is considered an admin of the bot if all set properties on one of the admin objects are true.

### Example:

**Remember:** Comments are not valid in JSON.

```javascript
{
    // other config properties
    admins: [
        {nickname: "^havvy$", username: "^havvy$", identifiedas: "havvy"},
        {identifiedas: "botmaster"}
    ]
}
```

This bot will accept as admins anybody who is havvy!havvy@* and identified to the account 'havvy',
along with anybody identified to the account 'botmaster'.

**Note:** On networks that have Unrealircd and Anope services, the user will only be identified to
the account while their nickname is the accountname being checked.

**Note:** With Tennu 0.7.2, if the user is using the same nickname as the checked accountname, and the
nickname is registered to them, on networks that send a 307 (RPL_WHOISREGNICK) will give true for
identifiedas. With future versions, this will be false unless the server does not also send a 330 response.

## Exports

If you make your own plugin with the admin role, make sure to include these functions in your exports for easy interopt.

### isAdmin(hostmask: Hostmask): boolean

Determines whether the user is an admin.

### requireAdmin(fn: Function): Function

Wraps a function making it require admin priviledges to use.