# TypeScript Source

Botmation's main source code is all in TypeScript. The built JavaScript is transpiled to the `/build` directory from the root project folder. See `package.json` in the parent directory for more details.

## Overview

There's 4 distinguishable things here:

1) `botnation/` for future "BotNation" web app
2) `mationbot/` for the bot class, `MationBot`
3) `bots/` for service/site specific code
4) `./example_bot.ts`, an example script using the `MationBot` class in crawling/interacting with Instagram (including login)

### BotNation

To be developed

A web app to manage all bots and review reports of the bots' actions. Will be developed, after `MationBot` completes v1.

### MationBot

`MationBot` class implements `MationBotInterface`

It's the class for instantiating bots. Create an instance, for each bot.

OOP as a wrapper, setup, encapsulating the Puppeteer page that the bot will operate on, while providing some OOP accessor/mutator methods for changing that page instance, destroying the bot when done, but took a step back, away from OOP design patterns, in providing a loosely coupled Declarative pattern for scraping and interacting with the page. This was done for a few reasons.

It keeps the `MationBot` class short, since we don't have a bunch of methods to implement in dealing with all the possible actions. All of these actions are separated (away from the class) async functions (return promises), following the `BotAction` interface. To use a `BotAction`, you use the `BotAction`'s Factory method. That way, you can customize the action, with dynamic scoping, then it enables the `MationBot` to inject the Puppeteer page, and whatever else it may need, in the future. The door was left open. We can change the "chain" like flow, of `actions()`, into a "pipe", where the resolved result of the past promise is provided as input into the next!

You run `BotAction`'s via `MationBot`'s special public method called `actions()`. It takes a list of Actions, to be ran in an async sequence. It's a chain of resolving promises, but your not restricted in how you chain them up, you can chain lists (chain on chains!). The `actions()` method's functionality was stripped away from the Class into its own Factory method called `BotActionsChainFactory`. That way, you can reuse the same functionality inside your own `BotAction`! Therefore, an Action can be another chain of Actions! A good example is the `login()` `BotAction` for instagram, found here: `/bots/instagram/actions/auth.ts`

### Bots

This project, originally, started out as a single bot, for Instagram. But, given the Declarative approach, with stripped out actions, we can support a lot more, without convoluting the main class, the engine, of our vehicle. So the Instagram functionality was modernized into this new Declarative approach. Instead of a hard-wired `authenticate()` method on the class, there is a separated Factory method that produces a login `BotAction`, tailored for Instagram.

So inside the `/bots` directory is a folder for each website this project supports. You're welcome to add your own, please do! Mostly, it's helper methods and actions, tailored for each website. There's a `selectors.ts` file in each folder, for the commonly used DOM selectors in interacting with the web page. 

### Example Instagram Bot

Found in this directory, it's the main file `example_bot.ts`. It shows a strong pattern in using the `MationBot` class. If you're just starting out, I recommend following the "Getting Started" guide from the root project's README, then playing around with this file. It's the shortest path into, seeing what you, can get the bot to do :) Once you've written a `BotAction`, they're super easy to get lost in, so have fun! The main script is programmed to run the example bot (just read the "Getting Started" section in the root README)