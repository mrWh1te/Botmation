<h1>Botmation</h1>

[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation) 
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation) 
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

A TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative way.

The name is a mix of Bot & Automation

Why choose Botmation?
------------------

It enables devs to re-use any action, or sequence of actions, with a simple composable format (chain).

It gives devs the option to use either an Object-Oriented class or follow a purely Functional approach.

It enables devs to write more functionality with less code.

Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

From NPM for programmatic use:

    npm install botmation

# Getting Started

There are simple examples to help you get started, and it depends on your preference of programming: Object-Oriented or Functional. 

1) Object-Oriented

You can use the `Botmation` [class](/src/botmation/class.ts). It provides two different constructor approaches, one static async method and a regular sync constructor method, depending on how you want to use it. Either way, you're going to use the `actions()` method, from the object instance, to run a chain of Bot Actions. 

See the [object-oriented example code](/src/examples/simple_objectoriented.ts) to get you started.

2) Functional

The `Botmation` class's `actions()` method is de-coupled from the class, meaning the function was replaced with a higher order function, called the [BotActionsChainFactory](/src/botmation/factories/bot-actions-chain.factory.ts). That factory function creates the Bot Actions chain function, but without losing any core functionality, you can use it directly.

See the [functional example code](/src/examples/simple_functional.ts) to get you started.

Either way, you'll use and create your own Bot Actions, to run in a chain. It's possible to compose chains of chains. Therefore, it makes it easy to reuse code, and effectively unit test your code, with less. 

Learn more about [Bot Actions here](/src/botmation/actions/README.md).

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

To get started with Bot Actions, visit the [Botmation: Actions documentation](/src/botmation/actions/README.md).

## Examples

In the `./src/examples` directory, exists a small collection of simple bots, for to you to copy and paste.

Run any of the bots with their respective command:
```
$ npm run example/instagram
$ npm run example/screenshots
$ npm run example/puppeteer-cluster
```
These commands will run the build script beforehand, so whatever changes saved to the TypeScript code, will be seen.

# Testing

Testing is done with [Jest](https://jestjs.io/). The testing coverage is focused on unit-testing the unique functionality provided by the library, integration testing the use of puppeteer's page's public methods, and e2e testing of the Object-Oriented class and Functional factory using a jest puppeteer preset.

Learn more about testing with the [Botmation: Tests documentation](/src/tests/README.md).

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



