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

It has a Compositional design with safe defaults for building bots with less code.

It has a learn at your own pace design, to hopefully inspire an appreciation for the possibilities of Functional programming.

It has 100% code test coverage.

# Introduction

Botmation is a library of composable functions called `BotAction`'s, for writing Puppeteer scripts in a fun, simple, & testable way.

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

1. Introduction
    - BotAction
    - Chain
    - Making BotAction's
2. Getting Started
    - Install
    - Library Reference // tutorial continuing the rabit hole
    - Documentation
    - Examples
3. Advanced Techniques
    - Injects
    - Pipe
    - Conditions
    - Loops
    - Error Handling
4. Dev Notes
    - Library Development
    - Library Testing
    - Issues/Feature Requests
    - Contributors

BotAction
---------

Botmation's goal is to cover all the possibilities of web crawling functionality with separate composable functions called `BotAction`'s.

A `BotAction` is an async function that does one particular thing. For example, change the page URL, take a screenshot, type something with a keyboard, click something with a mouse, manage your Instagram account, etc. Some kind of User based web automation, from really specific minute to high-level tasks.

<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="190" align="right">

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

Making BotAction's
------------------

The way you make a custom `BotAction` is the same way the library makes them. The library exposes the same parts that it uses to make simple to complex ones, but for now, let's start with the simplest.

The simplest kind of BotAction is one that has no higher order sync functions to customize the async functionality. Let's take a look at an example `BotAction` from "Navigation", called `waitForNavigation`:

```typescript
const waitForNavigation: BotAction = async(page) => {
  await page.waitForNavigation()
}
```

This is as simple as it gets. When there is no need to add a layer of customization to the `BotAction`, then there is no need to wrap it with higher-order sync functions. Simplicity is great, use this style when possible. Let's see this `BotAction` assembled in a `chain()`:

```typescript
await chain(
  login({username: 'username', password: 'password'}),
  waitForNavigation, // <- no ()
  log('Done')
)(page)
```
See there is no sync function calls to use `waitForNavigation`, it's a constant that is equal to a `BotAction`. Nice and simple.

Now what if you want to create a `BotAction` that is customizable? Let's take a look at a simple one, in "Navigation" called `reload()` that simply reloads the browser page, like hitting the "refresh" button with some optional `options`:

```typescript
const reload = (options?: NavigationOptions): BotAction =>
  async(page) => {
    await page.reload(options)
  }
```

This syntax is the most common in the `BotAction`'s of Botmation. A single higher-order sync function that provides customizing parameters with safe defaults, for a returned async function (`BotAction`). Here, we manually `await` Puppeteer `Page`'s `reload()` method and pass in the higher-order `options` parameter, to customize the reload operation.

The higher order parameters can be whatever you need them to be, on a function by function basis. They're typed as a spread array of `any`, so add more if you need more. Also, you are not limited to one higher-order sync function, you can stack them up, as high as you need! The possibilities are truly endless, but try to keep it simple & composable.

Now what if you want to create a `BotAction` to handle a high-level task, like in a complex User-Story. This `BotAction` will need to run a bunch of other `BotAction`'s, in order to complete its task. For this, we use Composition to compose a new `BotAction` from an assembly line of other `BotAction`'s.

It's all up to you, as to how you need to orchestrate it. Let's get started with a helpful example, a `login()` `BotAction` for a common scenario:

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

It looks magical, but the typing all works out.

`login()` is a sync function that provides customization for `username` and `password`. It returns a `BotAction`, which is made from a composition of other `BotAction`'s. That composition is made through an Assembly Line, in this case, `chain()`.

Here, we see only one call of `chain()` (the sync call), and don't see the second call of `chain()()` (the async `BotAction` call). That's because, we don't want too here. We're not running a bot just yet, but building a bot part so we're composing the `BotAction`. The second call of `chain()()` is the `BotAction` that we want to return, not run.

It's all strongly typed, so if you're worried about remembering when to call the second call or first, don't, Botmation's strong typing will catch that for you through an IDE Intellisense.

For now, it's best to think about your tasks as parts to build, making them easy to test, and then compose solutions (bots) for all high level problems.

[Botmation: Actions documentation](/src/botmation/actions/README.md)

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need [node.js](http://nodejs.org/) LTS and the TypeScript compiler (`tsc`) installed globally (or some kind of transpiling).

Install
-------

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

Install Botmation with `npm` and save it as a dependency:

    npm install -s botmation

If you're just getting started, install `puppeteer` latest v2 & `@types/puppeteer` v3.0.1:

    npm install -s puppeteer@">=2.0.0 <3.0.0" @types/puppeteer@3.0.1

While `Botmation` source code works with major version 3, 4, and 5, the e2e testing has a bug that is limiting the packaging, as of this moment. If you want to use Botmation with the latest version, you'll need to close the repo locally and work from the playground bot. From there you can install the latest `@types/puppeteer` and `puppeteer` then build Botmation source code with it, just the E2E tests will become unstable.

Library Reference
-----------------

After intalling through `npm`, you should import all `BotAction`'s from the main module: 
```javascript
import { chain, goTo, screenshot } from 'botmation'
```

But, as a reference, the `BotAction`'s are organized in multiple files, by type, in the `/actions` directory of the library.

As of v2.0.x, there are 13 groups of actions to build from: 

 - `assembly-line`
    - assemble and run `BotAction`'s in lines
 - `console`
    - log messages to the nodeJS console
 - `cookies`
    - read/write page cookies
 - `errors`
    - try/catch errors in assembly-lines
 - `files`
    - customize `BotAction`'s for cookies and outputs
 - `indexed-db`
    - read/write to page's IndexedDB
 - `inject`
    - insert new injects into a line of `BotAction`'s
 - `input`
    - simulate User input like typing and clicking with a mouse
 - `local-storage`
    - read/write/delete from a page's Local Storage
 - `navigation`
    - change the page's URL, wait for form submissions to change page URL, back, forward, refresh
 - `output`
    - output files to local disk like screenshots, pdf's
 - `utilities`
    - handle more complex logic patterns like if statements and for loops


Documentation
-------------

To learn about the available `BotAction`'s visit the [Botmation: BotAction's Documentation](/src/botmation/actions/README.md).

Examples
--------

In the `./src/examples` [directory](/src/examples) of this repo (excluded from the npm module), exists a small collection of simple bots, to help you get going.

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
You can go into any of these and make changes, then build the source code and run them again. There is a simple object oriented example, that can give ideas on how functions of a class can just be composed `BotAction`'s. Do it however you want.

### Running Bots Concurrently

This project works with the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) module, so you can run multiple bots concurrently!

To get started, check out the [examples/puppeteer-cluster.ts](/src/examples/puppeteer-cluster.ts) on how to set up multiple bots. You can use both the Object-Oriented class or go purely functional. The example has both. 

You can copy/paste the code locally or clone this repo locally, install the npm dependencies, then run this command:

```
npm run build && npm run examples/puppeteer-cluster
```

It will build the project source code then run the puppeteer-cluster example.

# Advanced Techniques

There's more you can do, given the composable nature of these functions. For starters, `BotAction`'s have an optional param, yet to be mentioned that's part of a higher order system called `injects`.

Injects
-------

Let's take a look at the actual `BotAction` Function interface:
```typescript
interface BotAction<R = void, I extends Array<any> = any[]> extends Function {
  (page: Page, ...injects: I) : Promise<R>
}
```

See, there is a second param, after `page` called `injects` which, by default, is a spread array of `any`. It's optional, you don't have to use it. But, it can be handy.

If you need to provide an object(s), value(s), service(s), etc. consistently to a line of `BotAction`'s, you can do so by injecting them. Let's see how we inject them in the first place:

```typescript
const service = new ServiceA()
const todaysDate = new Date()

await chain(
    // ... actions
)(page, service, todaysDate)
```

The assembled `BotAction`'s in the `chain()` will be called with `service` and `todaysDate` as the second and third parameters. For example, the "Output" `BotAction`'s are a special interface of `BotAction` called `BotFilesAction`. Special interfaces of `BotAction` simply type the `injects` they are expecting, so in the case of `BotFilesAction`, `BotFileOptions` is the type of the first inject.

Now, what if you want to compose a line of actions, but with new injects? You can use the `inject()()` `BotAction` to inject new injects, before higher level injects. A few `BotAction`'s are composed with `inject()()` like `files()()` and `indexedDBStore()()`. Those composed `BotAction`'s inject the first few `injects` (before passing in any other injects from a higher context) for the declared `BotAction`'s assembled.

Pipe
----

There's another kind of Assembly Line for passing data from one `BotAction` in a line to the next `BotAction`, and so forth. It's called Pipe. When `BotAction`'s are assembled in a Pipe, the values they return (technically wrapped in Promises, but abstracted away by the async/await generators), are "piped" into subsequent `BotAction`'s. It does this by wrapping the value in a branded object, for type gaurding, called `Pipe` then injects the `Pipe` object at the very end of the `injects`.

So how about some useful examples to understand why. What if you want to compose a Bot that does things with Local Storage. Maybe the authentication of the Bot relies on Local Storage to determine if the Bot is logged in or not, how would that be done in a composed way? That's where Piping comes in, as it allows a `BotAction` to return a value for another `BotAction` to operate with.

Let's get started with a simple example of writing and reading a value to Local Storage:
```typescript
await pipe()(
   setLocalStorageItem('userID', '12345'),
   getLocalStorageItem('userID'), // this will pipe '12345' into the next `BotAction`
   log('User ID is in the Pipe')
)(page)
```
Now, instead of diving into Local Storage `BotAction`'s, let's just consider what's happening in the context of this Assembly Line: Pipe. `setLocalStorageItem()` set a key/value in Local Storage, and does *not* return a value. However, `getLocalStorageItem()` reads the value by the `key` given, then returns it. Unmentioned before, the "Console" `BotAction`'s support logging the Pipe value, when there is a Pipe, so the `pipe()()()` above will log to console the Pipe value of `12345`.

`pipe()()()` runs the assembled actions and checks for values returned. When a function doesn't return a value, that is considered an `Empty Pipe`. Empty pipes are still injected at the end. They look like this:

```typescript
const anEmptyPipe = {
    brand: 'Pipe',
    value: undefined
}
```
If there is no Pipe injected into a `pipe()()` from a higher context, then the `pipe()()()` itself will inject an empty one into each assembled `BotAction`.

So in essence, if a `BotAction` does not return a value, it effectively empties the current Pipe value. It's important to know.

There are also separate functions in this library, that you will find in the module, that are not `BotAction`'s but regular functions, mostly pure, that help in some way. There are many `helper` functions for when your piping.

To name a few, there are `unpipeInjects()`, `removePipe()`, `getInjectsPipeValue()`, `wrapValueInPipe()`, `pipeInjects()`, and so forth. They do what they sound like they do. When starting out, the first three are most relevant.

If you're not interested in whats injected, but the Pipe value, use `getInjectsPipeValue()` it has safe fallbacks for when there is no Pipe, etc. See the Local Storage `BotAction`'s for examples.

If you're interested in the injects and what's possibly in the Pipe, use `unpipeInjects()`, which allows you to specify the number of `injects` you're expecting, and safely get a Pipe value even if there is no Pipe. See the IndexedDB `BotAction`'s for examples.

If you just want the `injects` without any Pipe, use `removePipe()`. All these helper functions are designed to be used in `BotAction`'s.


Conditions
----------

What if you want to run an assembly line of actions, but only after finding something in the Page to be true? Botmation has you covered in a special type of `BotAction` called `Utilities`.

Let's get started with the simplest one called `givenThat()()` that is basically a functional if statement.

Here's a simplified bit of code from the Instagram example that attempts to login, only, *if* the "User" is a Guest:

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

`givenThat()` accepts a `ConditionalBotAction` that is a `BotAction` that returns a boolean value. If the value returned is `TRUE`, then the assembled actions are ran in a Pipe.

Loops
-----

What about running the same scraping `BotAction` or actions in a for loop against an array of website url's? It's a common web crawling use-case. Botmation has you covered. From the `BotAction`'s type "Utilities" exists `forAll()()` that will iterate a collection (object of key/value pairs or an array) passed in `forAll()` against a callback function that returns a `BotAction` or an array of `BotAction`'s.

Let's see an example:
```typescript
await chain(
    forAll(['google', 'facebook'])(
        (siteDomain) => ([ // you can name the variable whatever you want in the closure
            goTo('http://' + siteDomain + '.com'),
            screenshot(siteDomain + '-homepage') // then re-use it in your BotAction setup
        ])
    )
)(page)
```
Here we pass in array of site domain's in the first call then in the second call pass in an anonymous function, which gets called on each loop iteration of the collection, which in this case is once for each site domain in the array.

When this `forAll()()` completes, it will have visted and screenshot each domain in the array, in the order declared. See documentation for more details.

Errors
------
Given the principle of 100% Composition, error handling has been omitted entirely from the library's core. Assembly Lines don't try to catch any errors, and this was done in favor of creating a simple composable solution for isolating errors in deeply nested assembly lines. The solution, is let you guess, another `BotAction` called `errors()()`.

`errors()()` wraps assembled `BotAction`'s of the second call, `errors()()` in a try/catch, where errors caught are logged in the console with the Errors Block Name provided in the first call, `errors()`. Let's see an example:

```typescript
await chain(
    errors('scrape flow 1')( // <-- error block name
        // actions to run in a wrapped try/catch:
        goTo('site to scrape'),
        // ... 
    ),
    log('this runs, even if errors()() catches something')
)(page)
```
So if any actions in the assembled second `errors()()` call throws an error, the error is caught by the `errors()()` `BotAction` and then logged to the console with the Error Block Name provided in the first function call `error()`. After an error is thrown, remaining actions assembled are stopped, but the higher order assembly-line continues.

`errors()()` checks the higher order context `injects` for a Pipe, and runs the assembled actions in a Pipe, only if a Pipe was detected.

Also, you can nest `errors()()` as deeply as you want. This is to help isolate, tough to find async bugs, in deeply nested assembly lines. Make sure to give each one an uniquely identifying Error Block Name, so you can identify where the error was caught. If a nested `errors()()` catches a thrown error, it effectively swallows it, so higher level `errors()()` will not see it. This helps isolate bugs in the async functionality.

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
