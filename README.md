<h1>
    Botmation
</h1>

[![npm](https://img.shields.io/npm/v/botmation)](https://www.npmjs.com/package/botmation)
[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation)
[![codecov](https://img.shields.io/codecov/c/github/mrWh1te/Botmation/master?label=codecov)](https://codecov.io/gh/mrWh1te/Botmation)
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation)
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

<img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/banner/1556x379v2.png" alt="Botmation Crew" width="474">

A TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative way.

<img alt="Baby Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/baby_bot.PNG" width="175" align="right">

Why choose Botmation?
---------------------

It empowers Puppeteer code with a simple pattern to maximize readability, reusability and testability.

It has a Compositional design with safe defaults for composing bots with ease.

It has a low learning curve, that hopefully, at your own pace, inspires an appreciation for the possibilities of Functional programming.

Botmation has 100% test coverage.

# Overview

Botmation is mostly a library of functions called `BotAction`'s for writing Puppeteer scripts in a reusable & composable manner.

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

1. Overview
    - BotAction
    - Chain
2. Getting Started
    - Install
    - Library Reference // tutorial continuing the rabit hole
    - Documentation
<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="230" align="right">
    - Examples
        - Object-Oriented
        - Concurrency
        - Instagram
3. Advanced BotAction's
    - Utilities
    - Errors
    - Inject
    - Pipe
        - IndexedDB & Local Storage
4. Dev Notes
    - Library Development
    - Library Testing
    - Issues/Feature Requests
    - Contributors

BotAction
---------

A `BotAction` is an async function that does one particular thing, like change the page URL, take a screenshot, type something with a keyboard, click something with a mouse, etc.

Botmation's goal is to cover all the possibilities of web crawling with `BotAction`'s, organized into themes and domains. Some `BotAction`'s are very simple, without any parameters, while others are complex with multiple higher-order sync functions that must be called to retrieve them. Either way, these functions are units for assembly, like in a factory. 

Assembling `BotAction`'s is done with a fundamental type of `BotAction` called `Assembly Lines`. `Assembly Lines` run a sequence of `BotAction`'s, one by one, in the order declared. The best one to get started with, is the simplest one, called `chain()()`.

Chain
-----

The `chain()()` `BotAction` runs the declared `BotAction`'s, in the order received. Here is an example of a `chain()()` that will run `BotAction`'s to take screenshots of various web sites:

```typescript
const page = await browser.newPage() // Puppeteer Browser

await chain(
    //
    // Declared BotAction's: (#. = order ran)

    // Take a screenshot of Google homepage
    goTo('https://google.com'), // 1. "Navigation" BotAction
    screenshot('google-homepage'), // 2. "Output" BotAction
    
    // Take a screenshot of Dogpile homepage
    goTo('https://dogpile.com'), // 3. 
    screenshot('dogpile-homepage') // 4.
)(page)
```

Each `BotAction` in the chain (`goTo()`, `screenshot()`) is ran asynchronously, one at a time. Now given `chain()` returns a `BotAction`, you can use it again, inside to isolate `BotAction`'s in their own line, or create a new `BotAction` that is a chain of other `BotAction`'s, doing complex stuff for a particular, high-level thing.


[Botmation: Actions documentation](/src/botmation/actions/README.md)

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need NodeJS and the TypeScript compiler (`tsc`) installed, if you haven't already, follow this guide.

> todo the guide above in another doc, hopefully just links

Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

Then install it with `npm`:

    npm i -s botmation

If you're just getting started, install `puppeteer` & `@types/puppeteer`:

    npm i -s puppeteer @types/puppeteer

Library Reference
-----------------

After intalling through `npm`, you can import either the `Botmation` class or the main `BotActionsChainFactory` function from the main module: 
```javascript
// Object Oriented, or Purely Functional
import { Botmation, BotActionsChainFactory as Bot } from 'botmation';
```

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

Documentation
-------------

To learn about the available Bot Actions, how to chain them together, and how to make your own, visit the [Botmation: Actions documentation](/src/botmation/actions/README.md).

Examples
--------

In the `./src/examples` [directory](/src/examples), exists a small collection of simple bots, to help you get going.

You can clone this repo, install npm dependencies, then build the source code:

<img alt="Blue Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/blue_bot.PNG" width="150" align="right">

```
npm run build
```

Then run each example with their own command:
```
npm run examples/simple_objectoriented
npm run examples/simple_functional
npm run examples/instagram
npm run examples/screenshots
npm run examples/pdf
```

See the [object-oriented example code](/src/examples/simple_objectoriented.ts) to get started.

See the [functional example code](/src/examples/simple_functional.ts) to get started.


### Running Bots Concurrently

This project works with the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) module, so you can run multiple bots concurrently!

To get started, check out the [examples/puppeteer-cluster.ts](/src/examples/puppeteer-cluster.ts) on how to set up multiple bots. You can use both the Object-Oriented class or go purely functional. The example has both. 

You can copy/paste the code locally or clone this repo locally, install the npm dependencies, then run this command:

```
npm run build && npm run examples/puppeteer-cluster
```

It will build the project source code then run the puppeteer-cluster example.

# Advanced BotAction's

There's more you can do, given the composable nature of these functions.

<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

Utilities
---------

`Utility` `BotAction`'s provide higher-order functions for conditionals and loops like if statements, and for each. Here's a simplified code bit from the Instagram example that attempts to login, only, *if* the "User" is a Guest:

```typescript
await chain(
    // "Console" BotAction
    log('Bot is running aka User'),

    // "Utility" BotAction givenThat() resolves a "Conditional" BotAction for a boolean value
    //    Given that the value resolves TRUE, run the actions declared inside the block
    givenThat(isGuest)(
        log('is guest so logging in'),
        login({username: 'account', password: 'password'}),
    ),

    givenThat(isLoggedIn)( // in case something went wrong
        log('bot is logged in')
    )
)(page)
```

Errors
------

Inject
------

Pipe
----
ie IndexedDB & Local Storage for getting values

# Dev Notes

Library Development
-------------------

First, clone the repo locally, then install the npm dependencies. You can build the library locally with this command:
```
npm run build
```

The [playground_bot](/src/playground_bot.ts) is a dedicated spot for trying out new Bot Actions, etc. You can run it's code, after running the build command, with:

```
npm run playground
```

Library Testing
---------------

All our testing (e2e, unit, and integration) is done with [Jest](https://jestjs.io/).

Learn more about the library's testing strategy and coverage with the [Botmation: Tests documentation](/src/tests/README.md).

Issues & Feature Requests
-------------------------

Open Issues on Github. Please specify if it's a feature request or a bug.

When reporting bugs, please provide sample code to recreate the bug, relevant error messages/logs, and any other information that may help.

Contributors
------------

### Code

[Michael Lage](https://github.com/mrWh1te) - [Blog](https://copynpaste.me)

### Art

[Patrick Capeto](https://www.instagram.com/patrick.capeto/) - [Email](mailto:me@patrickcapeto.com)
