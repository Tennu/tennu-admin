# Admin Plugin for Tennu

![Travis Status](https://img.shields.io/travis/Tennu/tennu-admin.svg) ![NPM Downloads](https://img.shields.io/npm/dm/tennu-admin.svg) ![Version](https://img.shields.io/npm/v/tennu-admin.svg) ![ISC Licensed](https://img.shields.io/npm/l/tennu-admin.svg) ![Github Issue Count](https://img.shields.io/github/issues/tennu/tennu-admin.svg) ![Github Stars](https://img.shields.io/github/stars/Tennu/tennu-admin.svg)

Gives administrative control to a [Tennu](https://github.com/Tennu/tennu) bot.

Depends on Tennu 4.7.0 or higher.

This plugin implements the 'admin' role. This role is deprecated.

## Installation

`npm install tennu-admin`

## Config

- "admins" : The list of admins allowed to use admin commands.
- "admin-commands" : List of commands that require admin privileges.
- "admin-failed-attempt-response" : Response returned when access to command is rejected.

```json
{
    "admin-commands": [
        "roll"
    ],
    "admins": [
        {
            nickname: "^name$",
            username: "^name$",
            hostname: "^your\.hostmask\.isp\.net$"
            identifiedas: "accountname",
        }
    ],
    "admin-failed-attempt-response": "You aren't allowed to use this command."
}
```

The admin-commands list is a list of commands that you want to only be used by
admins. Some plugins require the `admin` plugin. For those, the author has
decided that it is better to always require `admin` control for those commands.

The nickname, username, and hostname fields of admin objects will be coverted
to case-insensitive regular expressions.

A person is considered an admin of the bot if all set properties on one of the
admin objects are true. In general, you should just have `identifiedas`
properties for your admins. Though using just `nickname` on Twitch also works.

### Example:

```javascript
    "admins": [
        {nickname: "^havvy$", username: "^havvy$", identifiedas: "havvy"},
        {identifiedas: "botmaster"}
    ]
```

This bot will accept as admins anybody who is havvy!havvy@* and identified to the account 'havvy',
along with anybody identified to the account 'botmaster'.

**Note:** On some networks, the user will only be identified to the account while their nickname
is the accountname being checked.

## Exports

### isAdmin(hostmask: Hostmask): boolean

Determines whether the user is an admin.

### requireAdmin(fn: Function): Function

Wraps a function making it require admin priviledges to use.

For example, see [tennu-control](https://github.com/tennu/tennu-control).