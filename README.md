<h1>
    <img src="https://raw.githubusercontent.com/mrWh1te/Botmation/major-v-1-prep/assets/art/group.jpg" alt="Botmation" width="400">
    <!-- <img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/group.jpg" alt="Botmation" width="400"> -->
    Botmation
</h1>

[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation) 
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation) 
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

A TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative way.

The name is a mix of Bot & Automation

Why choose Botmation?
---------------------

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

# Library Reference

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

# Examples

In the `./src/examples` directory, exists a small collection of simple bots, for to you to copy and paste.

Try try any of them out, first build the source code:
```
npm run build
```

Then run any example, like:
```
npm run examples/simple_objectoriented
npm run examples/simple_functional
npm run examples/instagram
npm run examples/screenshots
```

# Running Bots Concurrently

This project works with the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) module, in running multiple bots, concurrently!

To get started, check out the [puppeteer-cluster example code](/src/examples/puppeteer-cluster.ts). 
You can run the code, with these commands:
```
npm run build
npm run examples/puppeteer-cluster
```

# Library Tests

Testing is done with [Jest](https://jestjs.io/). The testing coverage is focused on unit-testing each Bot Action, integration testing the use of puppeteer's page's public methods in those actions, and e2e testing of the Object-Oriented class and Functional factory.

Learn more about testing with the [Botmation: Tests documentation](/src/tests/README.md).

## Library Development

To build the library locally, run this command:
```
npm run build
```

The [playground_bot](/src/playground_bot.ts) is a dedicated code space for trying out new Bot Actions, etc. You can run it's code, after running the build command, with:
```
npm run playground
```

## Issues, Feature Requests

Open Issues on Github. Please specify if it's a feature request or a bug.

When reporting bugs, please provide sample code to recreate the bug, relevant error messages/logs, and any other information that may help.

## Contributors

### Code

[Michael Lage](https://github.com/mrWh1te) - [Blog](https://copynpaste.me)

### Art

[Patrick Capeto](https://www.instagram.com/patrick.capeto/) - [Email](mailto:me@patrickcapeto.com)