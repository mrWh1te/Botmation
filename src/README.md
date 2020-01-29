# TypeScript Source

Botmation's main source code is all in TypeScript. The built JavaScript is transpiled to the `/build` directory, outside, from the root project folder.

## Overview

6 Directories, without their own mindsets and views.

1) `botnation/` for future "BotNation" web app
2) `bots/` for service/site specific code (actions, helpers)
3) `examples/` various bot examples (instagram, running a cluster)
4) `helpers/` shared folder for functions across the other sibling directories
5) `mationbot/` the rock that this project is built on for the `MationBot` class
6) `tests/` we are using jest for our testing & have the environment preset for puppeteer

This project is centered around (5) `MationBot`. Everything builds on top of it. 

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

### Examples

Found in the `/examples` directory

##### Instagram Bot

It's the `instagram.ts` file. Has an Authentication process for you to copy paste.

##### Puppeteer Cluster

It's the `puppeteer-cluster.ts` file. Shows a way to use the `puppeteer-cluster` module in running many bots concurrently. Quite fast, given the headless mode.

##### Screenshots Bot

It's the `screenshots.ts` file. Shows the various ways to use the screenshot `BotAction`'s found in `./mationbot/actions/output.ts`.