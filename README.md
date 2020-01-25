# Botmation

A NodeJS bot, called `MationBot`, for Declaratively using [Puppeteer](https://github.com/puppeteer/puppeteer) in crawling & interacting with the web.

Bot // Auto + mation => Bot + mation

## Overview

Current:
 - `MationBot` class with method `actions()` for declaratively executing async tasks, `BotAction`'s, sequentially
 - Social media site specific action's ie Instagram for automating login

In dev:
  - General Instagram Crawling/Interacting `BotAction`'s

Future:
 - Management web app tool
 - Expanding upon injection to include data attached to the bot, and perhaps options

This project focuses on a composable way of chaining bot actions in linear sequences. Interfaced by, `BotAction`, the methods are used in a `MotionBot` instance call of `.actions()`. 

That said, a `BotAction` can represent a whole other chain of actions, by using the `BotActionsChainFactory`. Also, there is an "if block" `BotAction` called `givenThat()` for running a chain of actions, if the condition proves TRUE.

Let's see some code:
```typescript
    import 'module-alias/register'
    import puppeteer from 'puppeteer'

    import { MationBot } from '@mationbot'

    // General BotAction's
    import { log } from '@mationbot/actions/console'
    import { screenshot, givenThat, wait } from '@mationbot/actions/utilities'
    import { loadCookies } from '@mationbot/actions/cookies'
    import { goTo } from '@mationbot/actions/navigation'

    // Instagram specific
    import { login, isGuest } from '@bots/instagram/actions/auth'
    import { getInstagramBaseUrl } from '@bots/instagram/helpers/urls'

    // Start up the Instagram bot with the Puppeteer Browser
    const bot = await MationBot.asyncConstructor(browser)

    // Actions run in a linear sequence, as declared
    await bot.actions(
      log('MationBot running'),
      loadCookies('instagram'),
      
      // a special BotAction that works like an if() {}
      givenThat(isGuest) (
        screenshot('login'), // saves screenshot as "login.png" in the screenshots directory
        // a BotAction from our instagram package:
        login({username: 'instagram username', password: 'instagram password'}) // automatically saves cookies
      ),

      goTo(getInstagramBaseUrl()),
      wait(5000),
      screenshot('feed'),

      log('Done!'),
    )
```

For a complete example, see the included [example_bot.ts](/src/example_bot.ts).

## Getting Started

You will need NodeJS LTS on your machine to run the bot(s). After you have that installed, install the npm dependencies with this command:

```
$ npm i
```
Once that's done, it will automatically run the Botmation CLI script, `createConfigFile`, to create the `./src/config.ts` file for you, following a short prompt. It will ask you for Instagram username and password for the example bot, as well as the cookies directory (which if you're not changing, you can just hit "enter" without typing anything for that)

Then build and run the example bot with this single command:
```
$ npm run botmation
```

It will run the example bot code found in `src/example_bot.ts`, which will login to Instagram with the credentials you provided in the script. It's recommended to begin experimenting with that file first.

## Architecture // Code Scaffolding

In terms of code patterns, it falls into 2 groups:

1) BotNation

Which has yet, to start development. A web app tool for reporting and management of the bots.

2) MationBot

Which is the heart and soul of this project. It provides a single class that has a Declarative `actions()` method, for chaining `BotAction`'s in an async sequence. These `BotAction`'s are provided by `BotActionFactory` methods. That allows for dev's to customize the `BotAction`, while injecting the active Puppeteer page for interaction (while keeping the door open for other injectables)

Explore directories in the `src/` folder, to read more documentation on each respective part. `README.md` files were added in the base structure, and more will be added, come time. Better documentation in the future.

### BotAction

What you'll spend the majority of your time working with. These factory produced functions are how you control the bots.

A `BotAction` is an async function (returns a promise) that uses a Puppeteer `Page` instance to crawl & interact with the web page (browser tab). They are de-coupled from the `MationBot` class and implement the `BotAction` interface. They are produced from factory methods following the `BotActionFactory` interface. That makes them customizable. These bots have a Declarative `actions()` method that is produced from the `BotActionsChainFactory` method. It's similar to the "pipe" syntax in RxJS, but we are not passing the result/output of one `BotAction` to the next. Hence, it's a chain of resolving promises.

It's flexible, given the linear nature of chains. It's possible for a `BotAction` to represent another chain of `BotAction`'s, by re-using the `BotActionsChainFactory`! In theory, you can do this over and over, infinitely, chains of chains of chains.

### Selectors

In the `bots/` directory, for each website, there is a `selectors.ts` file that describe the main DOM elements, a bot will interact with, ie the auth form's login input (to click for focus, so the bot can type the username).

### Config

The main config file is `src/config.ts`. It's used by the example bot script for saving Instagram auth credentials. 

Follow the "Getting Started" section in getting the file ready, since it's ignored by Git (if you clone the project, it will be missing). There is a planned CLI script to automatically build it for you, upon various input.

## Running a Nation of Bots

The `MationBot` class supports the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) package to run multiple bots in parallel! An example script will be provided in the future, but the heart of it, looks like:

```
cluster.queue(data, async(page, ...) => {
  const bot = new MationBot(page)

  await bot.actions(
    ...
  )
})

```

You can provide "Task" functions to the `cluster.queue()` method, so the Function provided, doesn't run on all workers (bots), so each bot can do its own thing.

## Manual Script Running

You can manually run the scripts ran by the main `botmation` script, in "Getting Started".

To build the runnable code, run this command:
```
$ npm run build
```

To run the built code, run this command:
```
$ npm run bot
```

This will run the example bot found here: `./src/example_bot.ts`

If you want to change the credentials of the Instagram bot for the example_bot code, mentioned above, simply run this command:
```
$ npm run createconfigfile
```

## Help

Feel free to open Issues in Github. Please provide sample code, screenshots, and any other relevant information.
