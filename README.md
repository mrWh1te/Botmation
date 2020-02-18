<h1>
    Botmation
</h1>
<img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/group.jpg" alt="Botmation" width="400">

[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation) 
[![codecov](https://codecov.io/gh/mrWh1te/Botmation/branch/master/graph/badge.svg)](https://codecov.io/gh/mrWh1te/Botmation)
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation) 
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

A TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative way.

The name is a mix of Bot & Automation

Why choose Botmation?
---------------------

It enables devs to do more with Puppeteer while writing less code.

It gives devs the tools to build Bot Actions in single purpose units and chains of units.

It empowers devs with composable Architecture and choice in approach of Object-Oriented or Functional.

Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

Then install it with `npm`:

    npm install botmation

# Getting Started

This project is centered around running units of Puppeteer code, or chains of those units, all called Bot Actions. It's a highly reusable approach to building Puppeteer scripts. To get started, read the [Botmation: Actions documentation](/src/botmation/actions/README.md). Besides that, there are two approaches to running these Bot Actions: Object-Oriented or Functional.

1) Object-Oriented

The `Botmation` [class](/src/botmation/class.ts) provides two different constructor approaches in creating instances: one static async method and a regular sync constructor method. Either way, after creating an instance, use the `actions()` method, to run a chain of Bot Actions.

See the [object-oriented example code](/src/examples/simple_objectoriented.ts).

2) Functional

The `Botmation` class's `actions()` method is loosely-coupled with the class. Its functionality is provided by a higher order function, called the [BotActionsChainFactory](/src/botmation/factories/bot-actions-chain.factory.ts) function. That factory function creates the `Botmation` `actions()` function. It's built loosely, so without losing any core functionality, you can skip the class, by using it directly.

See the [functional example code](/src/examples/simple_functional.ts).

# Library Reference

After intalling through `npm`, you can import the class or the bot actions chain factory directly from the main module:
```javascript
// Class or the Bot Chains Factory
import { Botmation, BotActionsChainFactory } from 'botmation';
```
The actions are organized in various files in the `/actions` directory, to be imported from each group:
```javascript
// Example of importing a couple of bot actions
import { goTo } from 'botmation/actions/navigation';
import { screenshot } from 'botmation/actions/output';
```

To learn how to use, chain and make Bot Actions, visit the [Botmation: Actions documentation](/src/botmation/actions/README.md).

# Examples

In the `./src/examples` directory, exists a small collection of simple bots, for to you to copy and paste.

If you clone this repo, you can try any of them out, after building the source code:
```
npm run build
```

Then run any example::
```
npm run examples/simple_objectoriented
npm run examples/simple_functional
npm run examples/instagram
npm run examples/screenshots
```

# Running Bots Concurrently

This project works with the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) module, in running multiple bots, concurrently!

To get started, check out the [puppeteer-cluster example code](/src/examples/puppeteer-cluster.ts). 
If you clone this repo, install dependencies, you can run the example code, with these commands:
```
npm run build
npm run examples/puppeteer-cluster
```

# Library Tests

All our testing is done with [Jest](https://jestjs.io/).

Learn more about the library's testing strategy and coverage with the [Botmation: Tests documentation](/src/tests/README.md).

## Library Development

Clone the repo, then install dependencies. You can build the library locally with this command:
```
npm run build
```

The [playground_bot](/src/playground_bot.ts) is a dedicated spot for trying out new Bot Actions, etc. You can run it's code, after running the build command, with:
```
npm run playground
```

## Issues & Feature Requests

Open Issues on Github. Please specify if it's a feature request or a bug.

When reporting bugs, please provide sample code to recreate the bug, relevant error messages/logs, and any other information that may help.

## Contributors

### Code

[Michael Lage](https://github.com/mrWh1te) - [Blog](https://copynpaste.me)

### Art

[Patrick Capeto](https://www.instagram.com/patrick.capeto/) - [Email](mailto:me@patrickcapeto.com)