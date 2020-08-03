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

It empowers Puppeteer code with a simple pattern to maximize code readability, reusability and testability.

It has a Compositional design with safe defaults for easily composing Puppeteer code.

It has a low learning curve, with a learn at your own pace, to hopefully inspire an appreciation for the possibilities of Functional programming.

It has 100% source test coverage.

# Introduction

Botmation is a library of composable functions called `BotAction`'s, for writing Puppeteer scripts in a fun, simple, & testable way.

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

1. Introduction
    - BotAction
    - Chain
    - Making Custom BotAction's
2. Getting Started
    - Install
    - Library Reference // tutorial continuing the rabit hole
    - Documentation
<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="215" align="right">
    - Examples
        - Object-Oriented
        - Concurrency
        - Instagram
3. Advanced
    - Utilities
    - Error Handling
    - Injects
    - Pipe
        - IndexedDB & Local Storage
4. Dev Notes
    - Library Development
    - Library Testing
    - Issues/Feature Requests
    - Contributors

BotAction
---------

Botmation's goal is to cover all the possibilities of web crawling functionality with separate composable functions called `BotAction`'s.

A `BotAction` is an async function that does one particular thing. For example, change the page URL, take a screenshot, type something with a keyboard, click something with a mouse, manage your Instagram account, etc. Some kind of User based web automation, from really specific minute to high-level tasks.

These functions are passed in a Puppeteer Page instance and are all organized by type. Some `BotAction`'s are very simple, without any parameters, while others are complex with multiple higher-order sync functions that must be called first, to retrieve the actual `BotAction`.

`BotAction`'s are designed for composing, that is they are all considered bot "parts" (units of functionality that make up web crawlers) that you declare in order, to build a bot that does what you need. Therefore, `BotAction`'s are for assembly, like in a car factory, assembly lines build the cars, part by part. Similarly, Botmation, has a particular type of `BotAction` that assembles `BotAction`'s into into new `BotAction`'s or bot parts, if you will.

> It's confusing at first, especially if your new to Functional programming, but a `BotAction` can both be a part of a Bot and a Bot itself, thanks to the compositional nature of the function's design. If you don't understand it right now, don't worry, keep on as the code is easier to get.

Assembling `BotAction`'s is done with a fundamental type of `BotAction` called `Assembly Lines`. `Assembly Lines` assemble `BotAction`'s in a sequence, one by one, in the order declared, then run the actions. The best one to get started with, is the simplest one, called `chain()()`.

Chain
-----

The `chain()()` `BotAction` runs the declared `BotAction`'s, in the order received. Here is an example of a `chain()()` that runs `BotAction`'s to take screenshots of Google & Dogpile:

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

The first call of `chain()` is a declared list of `BotAction`'s to run in order, and the second call of `chain()()` is the actual `BotAction`, for which a `page` instance is passed. The `BotAction`'s assembled run on the passed in chain's page.

Therefore, Botmation let's us use higher-order sync functions to compose async functionality, all while typing less (how many `await` statements do you see?).

But, wait, it gets better, you can nest infinitely deep, in theory (limited by hardware resources). Since `chain()` returns a `BotAction`, you can use it again as an action, to isolate `BotAction`'s in their own line, or create a new `BotAction` that is a chain of other `BotAction`'s in a separate chain, doing complex stuff for a particular, high-level thing. It's actually the way high-level task based `BotAction`'s are usually composed.

Making Custom BotAction's
-------------------------

A `BotAction` can be written manually as an async function operating on a Puppeteer `page`. a `BotAction` can be composed of other `BotAction`'s, or even a mix of custom and manual. It's all composable, up to you, as to how you want to play with them, but let's get started with a helpful example, a `login()` `BotAction` for a pretend website:

```typescript
const login = ({username, password}: {username: string, password: string}): BotAction =>
  chain(
      goTo('https://example.com/login.html'),
      click('form input[name="username"]'),
      type(username),
      click('form input[name="password"]'),
      type(password),
      click('form button[type="submit"]'),
      waitForNavigation,
      log('Login Complete')
  )
```
`login()` is a sync function that returns a `BotAction`, an async function. Here we see only one call of `chain()` (the same `chain()` in the code example above) but we don't see the second call of `chain()()` where the `page` is passed in and the function is `await`ed. That's because, we don't want too. The second call of `chain()()` is the `BotAction` so here we use the higher-order call of `chain()` to compose other `BotAction`'s in a line, which then returns a `BotAction` to actually run the line with the, to be, provied Puppeteer `page`.

That's cool, but kind of magical, how about a manual, non-composed `BotAction` to help understand what they are? Most of the rudimentary `BotAction`'s are built manually, as in, not a composition of other actions.

Let's take a look at a simple one, in "Navigation" called `reload()` that simply reloads the browser page, like hitting the "refresh" button:

```typescript
const reload = (options?: NavigationOptions): BotAction =>
  async(page) => {
    await page.reload(options)
  }
```

This syntax is common in the building blocks of Botmation. A single higher-order sync function that provides customizing parameters for a returned async function (`BotAction`). Here, we manually `await` Puppeteer `Page`'s `reload()` method and pass in the higher-order `options` param.

The higher order params can be whatever you need them to be, on a function by function basis. They're typed as a spread array of `any`. Also, you are not limited to one higher-order sync function, you may go as high as you want! The possibilities are truly endless, but keep it simple.

As for completion sake, let's look at the simplest kind of BotAction, one that has no higher order sync functions that customize the async functionality. Again let's take a look at a `BotAction` from "Navigation", called `waitForNavigation`:

```typescript
const waitForNavigation: BotAction = async(page) => {
  await page.waitForNavigation()
}
```

This is as simple as a `BotAction` gets. When there is no need to customize the `BotAction` with higher-order params, then there is no need for any higher-order sync functions. Simplicity is great. How about let's see this `BotAction` composed in a `chain()`:

```typescript
await chain(
  login({username: 'username', password: 'password'}),
  waitForNavigation, // <- no ()
  log('Done')
)(page)
```
See there is no sync function calls with `waitForNavigation`, it's a constant that is equal to a `BotAction`. Nice and simple.

[Botmation: Actions documentation](/src/botmation/actions/README.md)

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need NodeJS and the TypeScript compiler (`tsc`) installed, if you haven't already, follow this guide.

> todo the guide above in another doc, hopefully just links

Install
-------

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

Install Botmation with `npm`:

    npm i -s botmation

If you're just getting started, install `puppeteer` & `@types/puppeteer`:

    npm i -s puppeteer @types/puppeteer

Library Reference
-----------------

After intalling through `npm`, you can import any `BotAction` from the main module: 
```javascript
import { chain, goTo, screenshot } from 'botmation'
```

The `BotAction`'s are organized in various files, by groups, in the `/actions` directory of the library.

As of v2.0.x, there are 13 groups of actions you can import from: 

 - assembly-line
    - assembly and run `BotAction`'s in lines
 - console
    - log messages to the nodeJS console
 - cookies
    - read/write page cookies
 - errors
    - try/catch errors in assembly-lines
 - files
    - customize `BotAction`'s for cookies, and output
 - indexed-db
    - read/write to page's IndexedDB
 - inject
    - insert new injects into a line of `BotAction`'s
 - input
    - Input as a User into a page like type and click
 - local-storage
    - read/write from a page's local storage
 - navigation
    - change the page's URL, wait for form submissions
 - output
    - output files to local disk like screenshots, pdf's
 - utilities
    - handle more complex logic patterns like if statements and for loops


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

<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

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
