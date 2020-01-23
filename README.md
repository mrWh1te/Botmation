# Botmation

A take-over project for [Instamation](https://github.com/mrWh1te/Instamation). Please use this, instead of that.

A library with a Declarative approach to using [Puppeteer](https://github.com/puppeteer/puppeteer).

Supports the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) package to run multiple bots in parallel!

## Overview

Current:
 - `MationBot` class with Declarative `actions()` in executing async tasks, `BotAction`'s, sequentially
 - Social media site specific action's ie Instagram for automating login

In dev:
  - General Instagram Crawling/Interacting `BotAction`'s

Future:
 - Management web app tool
 - Expanding upon injection to include data attached to the bot, and perhaps options

## Getting Started

You will need NodeJS current version or LTS on your machine to run the bot(s), as of writing this. After you have that installed, install the npm dependencies with this command:

```
$ npm i
```

Then, inside the `src/` directory, create a `config.ts` file with the following, but replace the text inside the quotes with your Instagram account credentials of who, you want the bot to login as:
```
export const ACCOUNT_USERNAME = 'put your username here'
export const ACCOUNT_PASSWORD = 'put your password here'
```

Then build and run the example bot with this single command:
```
$ npm run botmation
```

It will run the example bot code found in `src/index.ts` that will login to Instagram and take a photo. It's recommended to begin there.

## Architecture // Code Scaffolding

In terms of code patterns, it falls into 2 groups.

1) BotNation

Which has to start development. A web app tool for reporting and management of the bots.

2) MationBot

Which is the heart and soul of this project. It provides a single class that has a Declarative `actions()` method, for chaining `BotAction`'s in an async sequence. These `BotAction`'s are provided by `BotActionFactory` methods. That allows for dev's to customize the `BotAction`, while injecting the active Puppeteer page for interaction (while keeping the door open for other injectables)

### Actions

Actions are how you use the bot to crawl/interact with the web page (browser tab). They implement the `BotAction` interface and are produced from factory methods implementing `BotActionFactory`. These bots have a Declarative `actions()` method that is produced from the `BotActionsChainFactory` method. It was separated out as a Function, from the Class, to allow us to reuse that functionality in a "pipe-like" syntax in calling `BotAction`s in sequence, asynchronously. However, we are not including the output of the last call as input for the next. There has been no need for it yet, but can be simply added. Hence, the function is considered more of a "chain" then a "pipe". Also, we may look into injecting not just the active tab (Puppeteer.Page), but also some data source and potentially options as optional params for `BotAction`'s to make some things configurable in another manner.

### Selectors

In the `bots/` directory, for each bot, there is a `selectors.ts` file that describe the main elements the bot will be interacting with, ie the auth form's login input (to click and type in).

### Config

The main config file is `src/config.ts`. It's useful when you're using the `asyncConstructor()` of the `MationBot` class. If you're going to be running multiple bots, you can forgo it by providing the values from that file in the `options` param, during construction. Just to be sure to follow the interface, to maintain expected data structure. 

Follow the "Getting Started" section in getting the file ready, since it's ignored by Git (if you clone the project, it will be missing). There is a planned CLI script to automatically build it for you, upon various input.

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

This will run the example bot found here: `./src/index.ts`

## Help

Feel free to open Issues in Github. Please provide sample code, screenshots, and any other relevant information.
