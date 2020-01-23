# Botmation

A take-over project for Instamation.

A declarative approach to using puppeteer.

[puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) package friendly, so you can run these bots in parallel!

## Features

 - Declarative syntax in using tasks, `BotAction`, previously called `InstamationAction`
 - Social media site specific action's ie Instagram for automating login

Future:
 - Management web app tool

## Getting Started

You will need NodeJS current version or LTS on your machine to run the bot, as of writing this. After you have that installed, install the npm dependencies with this command:

```
$ npm i
```

Inside the `src/` directory, create a `config.ts` file with the following, but replace the text inside the quotes with your account credentials of who, you want the bot to login as:
```
export const ACCOUNT_USERNAME = 'put your username here'
export const ACCOUNT_PASSWORD = 'put your password here'
```

Then build and run the example bot with this single command:
```
$ npm run botmation
```

## Architecture // Code Scaffolding

Code architecture is currently a WIP. Notes will be updated as work is done, and finalized on complete. This note will be removed on finalization

WIP

Main code is stored in the `src/` directory. More notes on scaffolding, once project matures further

## Manual Scripts

You can manually run the scripts ran by the main `botmation` script, in "Getting Started".

To build the runnable code, run this command:
```
$ npm run build
```

To run the built code, run this command:
```
$ npm run bot
```

## Selectors

In the `bots/` directory, for each bot, there is a `selectors.ts` file that describe the main elements the bot will be interacting with, ie the auth form's login input (to click and type in).

## Config

The main config file is `src/config.ts`. Follow the "Getting Started" section in getting that file ready. There is a planned CLI script to automatically build it for you, upon various input.

## Actions

Actions are how you use the bot to crawl/interact with the web page (browser tab). They implement `BotAction` and are produced from factory methods implementing `BotActionFactory`. This bot has an `actions()` method that is produced with the `BotActionsChainFactory`. It was separated to allow us to reuse that functionality in a "pipe-like" syntax in calling Actions in sequence, asynchronously. However, we are not including the output of the last call as input for the next. There has been no need for it yet, but can be added.
