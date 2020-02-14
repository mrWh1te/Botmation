<h1>Botmation</h1>

[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation) 
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation) 
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

A TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative way.

The name is a mix of Bot & Automation

Why choose Botmation?
------------------

It enables devs to re-use any action, or sequence of actions, with its simple composable format (chain).

It gives devs the option to use either an Object-Oriented class or follow a purely Functional approach with the `BotActionsChainFactory`.

It enables devs to write more code with less characters, by chaining sequences of actions together with one `await` function call.

Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

From NPM for programmatic use:

    npm install botmation

# API Reference

Assuming installation via NPM, you can load the class or the bot actions chain factory like this:
```javascript
// Class or the Bot Chains Factory
import { Botmation, BotActionsChainFactory } from 'botmation';
```
The actions are organized in various files in the `/actions` directory, and can be imported like this:
```javascript
// Example of importing a couple of bot actions
import { goTo } from 'botmation/actions/navigation';
import { screenshot } from 'botmation/actions/output';
```

To learn about the Bot Actions, visit the [Botmation: Actions docs](/src/botmation/actions/README.md).

# Examples

# Library Testing

 - `Botmation` class with method `actions()` for declaratively executing async tasks, `BotAction`'s, sequentially
   - supports completely functional approach, bypassing the Class by using the `BotActionsChainFactory`
 - Social media site specific action's ie Instagram for automating login
 - unit/integration testing of all `BotAction` factory methods
 - e2e testing for the `Botmation` class constructor, static asyncConstructor
 - unit testing of `BotActionsChainFactory` with nesting
 - travisCI running builds (required passing latest code via PR's b4 merge)
 - example bots (including how to run bots concurrently using `puppeteer-cluster`)

In dev:
  - Instagram Specific Crawling/Interacting `BotAction`'s
  - Cleaning Up / Preparing Docs for v1
  - Mascot team (working with a talented Artist)

Future:
 - Management web app tool (might do Electron, and try to run the bots from the Electron app)
 - Expanding upon injection to include data attached to the bot, and perhaps options (depending on the requirements of the management app)

This project focuses on a composable way of chaining bot actions in linear sequences. Interfaced by, `BotAction`, the methods are used in a `MotionBot` instance call of `.actions()`. That said, you can simple use the `BotActionsChainFactory` by supplying it the page directly, for a completely functional approach.

A `BotAction` can represent a whole other chain of actions, by re-using the `BotActionsChainFactory`. All of these are de-coupled functions, which made testing much simpler.

Let's see some code:
```typescript
    import puppeteer from 'puppeteer'

    import { Botmation } from 'botmation'

    // General BotAction's
    import { log } from 'botmation/actions/console'
    import { screenshot, givenThat, wait } from 'botmation/actions/utilities'
    import { loadCookies } from 'botmation/actions/cookies'
    import { goTo } from 'botmation/actions/navigation'

    // Instagram specific
    import { login, isGuest } from '@bots/instagram/actions/auth'
    import { getInstagramBaseUrl, getInstagramLoginUrl } from '@bots/instagram/helpers/urls'

    // Start up the Instagram bot with the Puppeteer Browser
    const bot = await Botmation.asyncConstructor(browser)

    // Actions run in a linear sequence, as declared
    await bot.actions(
      log('Botmation running'),
      loadCookies('instagram'),
      
      // a special BotAction that works like an if() {}
      givenThat(isGuest) (
        goTo(getInstagramLoginUrl()),
        screenshot('login'), // saves screenshot as "login.png" in the screenshots directory
        // a BotAction from our instagram package:
        login({username: 'instagram username', password: 'instagram password'}),
        saveCookes('instagram')
      ),

      goTo(getInstagramBaseUrl()),
      wait(5000),
      screenshot('feed'),

      log('Done!'),
    )
```

For complete examples, see the included [here](/src/examples/).

For the latest actions, including experimental under development, check out the [playground bot](/src/playground_bot.ts).

## Example Bots

In the `./src/examples` directory, exists a small collection of simple bots, for to you to copy and paste.

Run any of the bots with their respective command:
```
$ npm run example/instagram
$ npm run example/screenshots
$ npm run example/puppeteer-cluster
```
These commands will run the build script beforehand, so whatever changes saved to the TypeScript code, will be seen.

## Running a Nation of Bots

The `Botmation` class supports the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) package to run multiple bots concurrently! Here's how the heart of it looks:

```
cluster.queue(data, async(page, ...) => {
  const bot = new Botmation(page)

  await bot.actions(
    ...
  )
})

```

You can provide "Task" functions, wrapping separate `Botmation` bots actions, to the `cluster.queue()` method, so each bot can operate individually. A complete working example is [available here](/src/examples/puppeteer-cluster.ts) running three bots concurrently.

## Manual Script Running

You can manually run the scripts ran by the main `botmation` script, in "Getting Started".

To build the runnable code, run this command:
```
$ npm run build
```

To run the built playground bot's code, run this command:
```
$ npm run playground
```

This will run the example bot found here: `./src/playground_bot.ts`

If you want to change the credentials of the Instagram bot for the example_bot code, mentioned above, simply run this command:
```
$ npm run createconfigfile overwrite
```
Instead of `overwrite` you can provide the shorthand `o`, to run the create config file script with it set to overwrite the current config file. It will still ask you, just in case.

## Issues, Feature Requests

Open Issues on Github. Please specify if it's a feature request or a bug.

When reporting bugs, please provide sample code to recreate the bug, relevant error messages/logs, and any other information that may help.

## Contributors

### Code Contributors

[mrWh1te](https://github.com/mrWh1te) - [Blog](https://copynpaste.me)

### Design Contributors



