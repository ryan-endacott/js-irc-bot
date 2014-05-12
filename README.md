js-irc-bot
==========

IRC bot that runs JavaScript in a safe(ish?) manner.


Runs JavaScript with the following command:

`js <JavaScript here>`

For example, type `js 3+3` and the bot will output `6`.  

### Built-in Functions

If you want to say something directly use the `say` function. 

Example:
`js for(var i = 0; i < 5; i++) say(i);` will output 0, 1, 2, 3, 4

If you want to clear the bot's message queue, use the `clear` function.

Example:

`js while(true) say('hi');`

The above line will timeout and won't crash the bot, but it will still spit out tons of messages.  To stop them, do this: 

`js clear();`

### Issues

The bot can currently be crashed by doing something like `a = new Array(really_big_number); say(a);`.  This is because the bot runs out of memory.  I'm not quite sure how to fix this other than doing un-fun things like removing the `Array` function.
