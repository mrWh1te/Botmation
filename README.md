<h1>
    Botmation
</h1>

[![npm](https://img.shields.io/npm/v/botmation)](https://www.npmjs.com/package/botmation)
[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation) 
[![codecov](https://img.shields.io/codecov/c/github/mrWh1te/Botmation/master?label=codecov)](https://codecov.io/gh/mrWh1te/Botmation)
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation) [![Greenkeeper badge](https://badges.greenkeeper.io/mrWh1te/Botmation.svg)](https://greenkeeper.io/) 
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

<img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/banner/1556x379v2.png" alt="Botmation Crew" width="474">

A TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative way.

Why choose Botmation?
---------------------

It enables devs to use Puppeteer with less code. <img alt="Baby Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/baby_bot.PNG" width="175" align="right">

It has a loose architectural pattern to build chains of simple reusable functions called Bot Actions.

It embraces flexibility with its design that enables the nesting of Bot Action chains.

It gives choice, like in approach: Object-Oriented or purely Functional.

Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

Then install it with `npm`:

    npm install botmation

If you're just getting started, install `puppeteer` & `@types/puppeteer`:

    npm install puppeteer @types/puppeteer

# Getting Started

This project is about breaking down Puppeteer code into simple reusable functions called Bot Actions. To get started with available Bot Actions, and how to make your own, read the [Botmation: Actions documentation](/src/botmation/actions/README.md). When it comes to using these actions, there are two provided approaches: Object-Oriented and Functional.

### 1) Object-Oriented

<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="180" align="right">

The `Botmation` [class](/src/botmation/class.ts) gives you two options in creating an object instance. 1) Provide a browser `page` from a Puppeteer instance to the main class constructor. 2) Provide the browser from a Puppeteer instance to the static class method `asyncConstrutor()`. The first approach is good when you want finer control of the browser page ("Chrome" tab) used. The second approach is a little simpler, but gives you less control on which page (browser tab) is used. 

Either way, after creating an instance, use the `actions()` method, to compose a chain of Bot Actions. These will run in sequence, one after the other. They are simple `async` functions, awaited one at a time, in a promise resolving chain.

See the [object-oriented example code](/src/examples/simple_objectoriented.ts) to get started.

### 2) Functional

The `Botmation` class's `actions()` method is provided by a higher order function, called the [BotActionsChainFactory](/src/botmation/factories/bot-actions-chain.factory.ts) function. It's the center piece of this project. It's an async function to resolve a chain of promises, or in this context, a chain of Bot Actions, one link at a time.

Therefore, you can skip the Object-Oriented Botmation class by directly using this function, without losing any core functionality. It can even be reused inside a Bot Action, to make one action represent a whole other chain of actions! Read more in the [Botmation: Actions documentation](/src/botmation/actions/README.md).

See the [functional example code](/src/examples/simple_functional.ts) to get started.

# Library Reference

After intalling through `npm`, you can import either the `Botmation` class or the main `BotActionsChainFactory` function from the main module: 
```javascript
// Object Oriented, or Purely Functional
import { Botmation, BotActionsChainFactory as Bot } from 'botmation';
```
<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

The actions are organized in various files in the `/actions` directory. As of v1.0.x, there are 6 groups of actions you can import from: 
```javascript
// Examples of importing a Bot Action from each group
import { log } from 'botmation/actions/console';
import { saveCookies } from 'botmation/actions/cookies';
import { click, type } from 'botmation/actions/input';
import { goTo } from 'botmation/actions/navigation';
import { screenshot } from 'botmation/actions/output';
import { forAll } from 'botmation/actions/utilities';
```

To learn about the available Bot Actions, how to chain them together, and how to make your own, visit the [Botmation: Actions documentation](/src/botmation/actions/README.md).

# Examples

In the `./src/examples` [directory](/src/examples), exists a small collection of simple bots, to help you get going.

You can clone this repo, install npm dependencies, then build the source code:
```
npm run build
```

Then run each example with their own command:
```
npm run examples/simple_objectoriented
npm run examples/simple_functional
npm run examples/instagram
npm run examples/screenshots
```

# Running Bots Concurrently

<img alt="Blue Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/blue_bot.PNG" width="150" align="right">

This project works with the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) module, so you can run multiple bots concurrently!

To get started, check out the [examples/puppeteer-cluster.ts](/src/examples/puppeteer-cluster.ts) on how to set up multiple bots. You can use both the Object-Oriented class or go purely functional. The example has both. 

You can copy/paste the code locally or clone this repo locally, install the npm dependencies, then run this command:

```
npm run build && npm run examples/puppeteer-cluster
```

It will build the project source code then run the puppeteer-cluster example.

# Library Development

First, clone the repo locally, then install the npm dependencies. You can build the library locally with this command:
```
npm run build
```

The [playground_bot](/src/playground_bot.ts) is a dedicated spot for trying out new Bot Actions, etc. You can run it's code, after running the build command, with:

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

```
npm run playground
```

## Library Tests

All our testing is done with [Jest](https://jestjs.io/).

Learn more about the library's testing strategy and coverage with the [Botmation: Tests documentation](/src/tests/README.md).

## Issues & Feature Requests

Open Issues on Github. Please specify if it's a feature request or a bug.

When reporting bugs, please provide sample code to recreate the bug, relevant error messages/logs, and any other information that may help.

## Contributors

### Code

[Michael Lage](https://github.com/mrWh1te) - [Blog](https://copynpaste.me)

### Art

[Patrick Capeto](https://www.instagram.com/patrick.capeto/) - [Email](mailto:me@patrickcapeto.com)
