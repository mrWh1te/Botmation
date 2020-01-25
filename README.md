# Botmation

A NodeJS bot, called `MationBot`, for Declaratively using [Puppeteer](https://github.com/puppeteer/puppeteer) in crawling & interacting with the web.

Bot / Auto + mation => Bot + mation

This is a take-over project for [Instamation](https://github.com/mrWh1te/Instamation). Please use this, instead of that.

## Overview

Current:
 - `MationBot` class with method `actions()` for declaratively executing async tasks, `BotAction`'s, sequentially
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
Once it's done installing npm dependencies, it will run the Botmation CLI script to create the `./src/config.ts` file. Hit "y" when it prompts you if you want to create it now, then follow the questionnaire to completion, then it will automatically generate the file for you. This is a necessary step to get the example Instagram bot running. 

Note, if before a question-mark, there are parenthesis with some text inside, that text represents the default value accepted, if you simply hit enter, with no typing. When it comes to setting the cookies directory, we recommend going with the default value.

Then build and run the example bot with this single command:
```
$ npm run botmation
```

It will run the example bot code found in `src/example_bot.ts` that will login to Instagram. It's recommended to begin there.

## Architecture // Code Scaffolding

In terms of code patterns, it falls into 2 groups:

1) BotNation

Which has yet, to start development. A web app tool for reporting and management of the bots.

2) MationBot

Which is the heart and soul of this project. It provides a single class that has a Declarative `actions()` method, for chaining `BotAction`'s in an async sequence. These `BotAction`'s are provided by `BotActionFactory` methods. That allows for dev's to customize the `BotAction`, while injecting the active Puppeteer page for interaction (while keeping the door open for other injectables)

Explore directories in the `src/` folder, to read more documentation on each respective part. `README.md` files were added in the base structure, and more will be added, come time. Better documentation in the future.

### BotAction

A `BotAction` is an async function (returns a promise) that uses a Puppeteer `Page` instance to crawl & interact with the web page (browser tab). They are de-coupled from the `MationBot` class and implement the `BotAction` interface. They are produced from factory methods following the `BotActionFactory` interface. That makes them customizable. These bots have a Declarative `actions()` method that is produced from the `BotActionsChainFactory` method. It's similar to the "pipe" syntax in RxJS, but we are not passing the result/output of one `BotAction` to the next. Hence, it's a chain of resolving promises.

However, it's flexible, given the linear nature of chains. It's possible for a `BotAction` to represent another chain of `BotAction`'s, by re-using the `BotActionsChainFactory`! In theory, you can do this over and over, infinitely, chains of chains of chains ..., but run the risk of using more memory, at large scale. The deeper nesting of the technique (not using the technique itself), the higher the memory use will be when the root action is ran. Basically, feel free to use it horizontally, a lot, every `BotAction` could be a chain of `BotAction`'s, maybe most yours will be, but avoid doing deeply vertical chaining. When that chains resolves... It's like a recursive function, but I didn't program an exit. If I find a limit while playing, perhaps I'll add some safe gaurds, to prevent it, like stop excuting X vertical length then omit a console Warning.

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

## Help

Feel free to open Issues in Github. Please provide sample code, screenshots, and any other relevant information.
