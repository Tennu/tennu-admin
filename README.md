# Admin Module for Tennu

Gives administrative control to a Tennu bot.

Depends on Tennu 0.6.* or higher.

## Config

These belong on the config object passed to the tennu.Client() function.

### admins property

In the config file, add an 'admins' property which takes a list of objects with the following format:

```javascript
{
    nick: "^name$",
    username: "^name$",
    hostmask: "^your\.hostmask\.isp\.net$"
    identified: true,
}
```

The nick, username, and hostmask fields will be turned into regular expressions.

A person is considered an admin of the bot if all properties on one of the admin objects are true.

All properties are optional. You could theoretically give everybody access by doing:  admins: [{}].

## Commands

* !join #chan
* !part [#chan]
* !quit

Channels default to the channel the command is submitted in.

No message is given on a failed or incorrectly sent command.

## Exports

If you make an admin module, make sure to include these functions in your exports.

### isAdmin(hostmask: Hostmask): boolean

Determines whether the user is an admin.

### requireAdmin(fn: Function): Function

Wraps a function making it require admin priviledges to use.