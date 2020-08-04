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

It empowers Puppeteer code with a simple pattern that maximizes code readability, reusability and testability.

It has a Compositional design with safe defaults for building bots with less code.

It encourages learning at your own pace, to hopefully inspire an appreciation for the possibilities of Functional programming.

It has 100% code test coverage.

# Introduction

Botmation is like a slightly opinionated framework for Puppeteer. In that it is a library of composable functions called `BotAction`'s for building web crawlers in a functional, testable, and declarative way.

`BotAction`'s handle common tasks in crawling and scraping the web. They are easily assembled into bots with varying functionality, using minimal code.

You can compose new `BotAction`'s from the ones provided and build your own from scratch.

The possibilities are truly endless!

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

BotAction
---------

<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

A `BotAction` is an async function that does a particular thing in the web. For example, change the page URL, take a screenshot of the window, type something with a keyboard, click something with a mouse, manage your Instagram account (login, like friends' posts), run all the tasks of a bot, etc. When these functions are ran together the entire functional composition becomes a bot that crawls the web to perform tasks, it was programmed to do.

These functions are all passed a Puppeteer Page as the first parameter. They are organized by type. Some `BotAction`'s are very simple, without any multiple higher-order sync functions to customize them, whiles others are wrapped in multiple functions that must be called first, before the actual `BotAction` can be resolved. More on that later.

`BotAction`'s are for composing bots so in essence, they are "parts" of bots for assembly. It's similar to a car factory, where cars are assembled on a line, part by part. Botmation assembles bots, and complex `BotAction`'s, with a particular type of `BotAction`, called `Assembly Lines`.

`Assembly Lines` assemble `BotAction`'s in the sequence declared, one by one. The best one to get started with, is the simplest one, called `chain()()`.

Chain
-----

The `chain()()` `BotAction` assembles the declared `BotAction`'s, in the order received. Each `BotAction` is a "link" in the chain.

Chains are `Assembly Lines` and therefore can be used to build Bots or complex `BotAction`'s, but more on that later. For now, let's focus on an example of a `chain()()` that assembles a bot to take screenshots of Google & Dogpile:

```typescript
const page = await browser.newPage() // Puppeteer Browser

await chain(
    // Take a screenshot of Google homepage
    goTo('https://google.com'), // 1. "Navigation" BotAction
    screenshot('google-homepage'), // 2. "Files" BotAction
    
    // Take a screenshot of Dogpile homepage
    goTo('https://dogpile.com'), // 3. 
    screenshot('dogpile-homepage') // 4.
)(page)
```

The first call of `chain()` is a sync function to assemble the declared list of `BotAction`'s for running. The second call of `chain()()` is the actual async `BotAction` function call, where a Puppeteer `page` is passed in, for all actions assembled to operate in.

Botmation leans on higher-order sync functions to compose async functionality and encourages you to do the same. A lot is possible with higher-order functions.

But, wait, it gets better, you can nest `Assembly Lines` infinitely deep, in theory. Since `chain()` returns a `BotAction`, you can use it again (and again.. and again...) as a regular `BotAction`. It can isolate `BotAction`'s in their own assembly lines, or can be used to create complex `BotAction`'s that use a chain to assemble other `BotAction`'s for one particular, high-level task. It's all composable that way. Let's learn about making `BotAction`'s to understand more.

Making BotAction's
------------------

The way you make a `BotAction` is the same way the Botmation makes them. First off, there's three main ways to write a `BotAction`, from simplest to the most complex. For now, let's get started with the simplest.

The simplest kind of BotAction is one that has no higher order sync functions to customize the async functionality. It's just one normal async function. Let's take a look at an example of one from "Navigation", called `waitForNavigation`:

```typescript
const waitForNavigation: BotAction = async(page) => {
  await page.waitForNavigation()
}
```

This is as simple as it gets. There are no additional layers of functions to customize the `BotAction`, as you can see, there are no higher-order sync functions wrapping it. Simplicity is great.

Now what if you want to create a `BotAction` that is more dynamic, customizable during assembly? Let's take a look at a simple one, in "Navigation" called `reload()` that reloads the browser page, like hitting the "refresh" button, but with some optional `options`:

```typescript
const reload = (options?: NavigationOptions): BotAction =>
  async(page) => {
    await page.reload(options)
  }
```

As we see here, a single higher-order sync function with an optional `options` param returns the `BotAction`. In the `BotAction`, the Puppeteer `Page`'s `reload()` method is resolved with `await` and pass in the higher-order `options` parameter, to customize the reload operation. This syntax is the most common in Botmation.

The higher order parameters can be whatever you need them to be. They're typed as a spread array of `any`, so add more if you need more. Also, you are not limited to one higher-order sync function, so stack them up, as high as you need! The possibilities are truly endless, but try to keep it as simple as possible & composable too.

> If you are new to composing, try to break things down into their simplest units that can be put together in any which way. It's a different way of thinking, compared to Classes and Imperative programming, but with time, like a muscle, can be developed!

Now what if you want to create a `BotAction` to handle a high-level task, like in an User-Story. This `BotAction` will need to run a bunch of other `BotAction`'s, in order to complete its task. For this level of complexity, we compose a `BotAction` with an `Assembly Line` of `BotAction`'s.

Let's get started with a common scenario, like a `login()` `BotAction` for a basic form:

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

It looks magical, but the typing keeps it all in check for us.

`login()` is a sync function that provides customization for the `username` and `password` entered into the form. It returns a `BotAction`, which is a Chain of other `BotAction`'s that when ran, are resolved one at a time.

Here, we see only one call of `chain()` (the sync call), and don't see the second call of `chain()()` (the async `BotAction` call). That's because, we don't want too here. We're not running the bot just yet, but building a bot part to handle logging in. The second call of `chain()()` is for running the `Assembly Line` of `BotAction`'s declared, like running the assembled bot in the code example at the top.

It's all strongly typed, so if you're worried about remembering when to make the first call or the second, don't. Botmation has your back with strong typing that will catch these errors, and more, through your IDE Intellisense (or during build).

For now, it's best to think about your web crawling tasks as multiple distinct (reusable) steps that can be parts of many bots, as separate functions that are easy to test, and then compose in varying solutions for all kinds of high level problems in web crawling.

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need [node.js](http://nodejs.org/) LTS installed and the TypeScript compiler (`tsc`) installed globally (or have a transpiling code step).

Install
-------

Install Botmation with `npm` and save it as a dependency:

    npm install -s botmation

If you're just getting started, install `puppeteer` latest v2 & `@types/puppeteer` v3.0.0:

    npm install -s puppeteer@">=2.0.0 <3.0.0" @types/puppeteer@3.0.0

While `Botmation` source code works with Puppeteer version 3, 4, and 5, the E2E testing has a bug that is limiting the packaging, as of this moment.

> If you want to use Botmation with the latest Puppeteer version, for now, clone the repo locally and work from the playground bot. From there you can install the latest `@types/puppeteer` and `puppeteer` packages then build Botmation source code with it. But, be wary, the E2E tests will become rather unstable.

Library Reference
-----------------

After intalling through `npm`, import any `BotAction` from the main module: 
```javascript
import { chain, goTo, screenshot } from 'botmation'
```

As a reference, the `BotAction`'s are organized by type, in the `/actions` directory of the library's source code.

As of v2.0.x, there are 12 groups of actions to build from: 

<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="190" align="right" style="position: relative;top: 30px;">

 - `assembly-line`
    - assemble and run `BotAction`'s in lines
 - `console`
    - log messages to the nodeJS console
 - `cookies`
    - read/write page cookies
 - `errors`
    - try/catch errors in assembly-lines
 - `files`
    - write files to local disk ie screenshots, pdf's
 - `indexed-db`
    - read/write to page's IndexedDB
 - `inject`
    - insert new injects into a line of `BotAction`'s
 - `input`
    - simulate User input ie typing and clicking with a mouse
 - `local-storage`
    - read/write/delete from a page's Local Storage
 - `navigation`
    - change the page's URL, wait for form submissions to change page URL, back, forward, refresh
 - `utilities`
    - handle more complex logic patterns ie if statements and for loops


Documentation
-------------

To learn about all the available `BotAction`'s visit the [Botmation: BotAction's Documentation](/src/botmation/actions/README.md).

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

Botmation is compatible with the [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster) module, making it easy to run multiple bots concurrently!

To get started, check out the [examples/puppeteer-cluster.ts](/src/examples/puppeteer-cluster.ts) on how to set up multiple bots. You can use both the Object-Oriented class or go purely Functional. The example has both. 

Clone this repo locally, install the npm dependencies, then run this command to try out the example:

```
npm run build && npm run examples/puppeteer-cluster
```

It will build the project source code then run the `puppeteer-cluster` example.

### Playground Bot

If you just want to play with this project without setting one up yourself, the quickest way is to:
1) Clone this repo locally
2) Install the npm dependencies while ignoring scripts: `npm install --ignore-scripts`
3) Rebuild the Puppeteer dependency (run its scripts): `npm rebuild puppeteer`
4) Play with the playground bot source code: `./src/playground_bot.ts`
5) After each playground change, build the project code: `npm run build`
6) Run the built playground bot: `npm run playground`

Have fun!

# Advanced Techniques

There's a lot more you can do with Botmation, given the composable nature of `BotAction`'s. For starters, `BotAction`'s have an optional param, yet to be mentioned that's part of a higher order system, called `injects`.

Injects
-------

Let's take a look at the actual `BotAction` Function interface:
```typescript
interface BotAction<R = void, I extends Array<any> = any[]> extends Function {
  (page: Page, ...injects: I) : Promise<R>
}
```

See, there is a second param, after `page` called `injects` which, by default, is a spread array of `any`. It's optional, you don't have to use it. But, it can be handy. All `Assembly Lines` supports the `injects` system.

If you need to provide an object(s), value(s), service(s), etc. consistently to a line of `BotAction`'s, you can do so by injecting them. Let's see how we inject them in the first place:

```typescript
const service = new ServiceA()
const todaysDate = new Date()

await chain(
    // ... actions
)(page, service, todaysDate)
```

The assembled `BotAction`'s in the `chain()` will be called with `service` and `todaysDate` as the second and third parameters.

Now, what if you want to compose a line of actions, but with new injects? You can use the `inject()()` `BotAction` to pass in new injects, prepended to the higher level injects. A few `BotAction`'s are composed with `inject()()` like `files()()` and `indexedDBStore()()`. Those composed `BotAction`'s inject the first few `injects` provided in the first `inject()` call then pass in the other injects from the higher context, for the declared `BotAction`'s.

Here's an example:
```typescript
const generalService = new GeneralService()
const specialService = new SpecialService()

await chain(
    inject(specialService)(
        goTo('http://example.com/special-page.html'),
        doSomethingSpecial()
        // these actions have `specialService` as their 1st inject
        // and `generalService` as their 2nd inject
    ),
    log('some message') // this log() BotAction will NOT have `specialService` injected
                        // but, will still have `generalService` as its 1st inject
)(page, generalService)
```
This gives granular control of what's passed in the spread `injects` array for assembled `BotAction`'s.

Pipe
----

There's another kind of Assembly Line, a special kind, that passes data from one `BotAction` in a line to the next `BotAction`, and so forth. It's called Pipe. When `BotAction`'s are assembled in a Pipe, the values they return (technically wrapped in Promises, but abstracted away by the async/await generators), are "piped" into subsequent `BotAction`'s. The Pipe handles this by wrapping the value resolved in a branded Pipe object (for type gaurding), called `Pipe` then injects the `Pipe` object at the very end of the spread `injects` array in the `BotAction`.

So how about some useful examples to understand when to use this. What if you want to compose a Bot that does things with Local Storage. Maybe the authentication of the Bot relies on data in Local Storage, how would one go about composing such functionality, where data must be scraped first before operating? That's where Piping comes in, as it allows a `BotAction` to return a value for the next `BotAction` to operate with.

Let's get started with a simple example of writing and reading a value to Local Storage:
```typescript
await pipe()(
   setLocalStorageItem('userID', '12345'),
   getLocalStorageItem('userID'),
   log('User ID is in the Pipe') // has '12345' as the Pipe valued logged to console
)(page)
```
Now, instead of diving into Local Storage `BotAction`'s, let's consider what's happening in the context of this Pipe. `setLocalStorageItem()` set a key/value in Local Storage, and does *not* return a value. However, `getLocalStorageItem()` reads the value by the `key` provided, then returns it. Unmentioned before, the "Console" `BotAction`'s support logging the Pipe value, when there is a Pipe, so the `log()` call will log to console the Pipe value of `12345`.

`pipe()()()` runs the assembled actions, one at a time, and checks the values returned from each. When a function doesn't return a value, that is considered emptying the Pipe. Empty pipes are still injected. They look like this:

```typescript
const anEmptyPipe = {
    brand: 'Pipe',
    value: undefined
}
```
If there is no Pipe injected into a `pipe()()` from a higher context, then the `pipe()()()` itself will inject an empty one into the first assembled `BotAction`. So no matter what, there is always a Pipe as the last inject, when a `BotAction` is assembled in a Pipe. Also, it's possible to set the Pipe value for the first `BotAction` by passing that in the first `pipe()` call.

There are a collection of `BotAction`'s specific to piping: `map()`, `pipeValue()`, and `emptyPipe`. The last two do what they say, and `map()` accepts a pure function to operate on the Pipe value, so if you want to cast the Pipe value from one type to another, `map()` is the `BotAction` to use. Let's see an example, `isGuest` from Instagram auth, uses `map()` to map the Pipe value to the appropriate boolean value:
```typescript
const isGuest: ConditionalBotAction = 
  indexedDBStore('redux', 'paths')(
    getIndexedDBValue('users.viewerId'),
    map(viewerId => viewerId ? false : true),
  )
```
Here we are getting a value from `redux` IndexedDB, from a store called `paths`, with the key `users.viewerId`, which in this case, at this time, returns a string or undefined. Then the returned value (Pipe value) is mapped to the correct values for `isGuest`. So if the `viewerId` is defined, then the Bot is considered logged in, therefore `isGuest` is `false` otherwise `true`.

There are also separate functions in this library, that you will find in the module, that are not `BotAction`'s but regular functions, mostly pure, that help build `BotAction`'s by removing boilerplate. For example, there are many `helper` functions for piping.

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

To name a few, there are `unpipeInjects()`, `removePipe()`, `getInjectsPipeValue()`, `wrapValueInPipe()`, `pipeInjects()`, and so forth. They do what they sound like they do and mostly expect an `injects` param. When starting out, the first three are the most relevant as they help write `BotAction`'s that can use the Pipe safely, so they can be used in a Chain.

If you're not interested in whats injected, but need the Pipe value, use `getInjectsPipeValue()` as it has safe fallbacks for when there is no Pipe, in case the `BotAction` is assembled in a Chain. See the Local Storage `BotAction`'s for examples, in how it's used.

If you're interested in the injects and the Pipe value, use `unpipeInjects()`, which allows you to specify the number of `injects` you're expecting, to safely retrieve them with the Pipe value, even if there was no Pipe, or some `injects` didn't get injected. See the IndexedDB `BotAction`'s for examples.

If you just want the `injects` without any Pipe, use `removePipe()`. All these helper functions are designed to be used in `BotAction`'s to reduce boilerplate.

Conditionals
------------

What if you want to run an assembly line of actions, but only after finding something in the Page to be true? Botmation has you covered with a special type of `BotAction` called `Utilities`.

Let's get started with the simplest one, called `givenThat()()`, a functional if statement.

Here's a simplified bit of code from the Instagram example that attempts to login, only, *if* the Bot is a Guest:

```typescript
await chain(
    // "Console" BotAction
    log('Bot is running aka User'),

    // "Utility" BotAction givenThat() 
    //    Resolves a "Conditional" BotAction for a boolean value
    //    Only if that value equals TRUE, then the actions assembled are ran
    givenThat(isGuest)(
        log('is guest so logging in'),
        login({username: 'account', password: 'password'}),
    ),

    givenThat(isLoggedIn)(
        log('Bot is logged in')
    )
)(page)
```

`givenThat()` accepts a special kind of `BotAction` called `ConditionalBotAction`. Therefore, `isGuest` and `isLoggedIn` are actually `BotAction`'s with stricter typing that returns a boolean value. If the value returned is `true`, then the assembled actions are ran in a Pipe.

So what happens is that `givenThat()` resolves the `ConditionalBotAction` which can be a complex composition of actions to determine something, in this case whether or not the Bot is logged in.

Looping
-------

What about running the same scraping `BotAction` or actions in a for loop against an array of website url's? It's a common web scraping scenario. Botmation has you covered. From the `BotAction`'s type "Utilities" exists a useful `BotAction` called `forAll()()` that will iterate a collection (either an object's key/value pairs or an array's values) against a callback function that returns a `BotAction` or an array of `BotAction`'s.

Let's see an example:
```typescript
await chain(
    forAll(['google', 'facebook'])(
        (siteDomain) => ([ // name the var whatever desired in the closure
            goTo('http://' + siteDomain + '.com'),
            screenshot(siteDomain + '-homepage')
        ])
    )
)(page)
```
Here we pass in a collection, an array of site domain's in the first call of `forAll()` then in the second call pass in an anonymous function, a closure, which gets called on each iteration of the collection, which in this case is once for each site domain in the array.

When this `forAll()()` completes, it will have visted and taken screenshots of each domain in the array, in the order declared. See documentation for more details & examples.

Error Handling
--------------
Error handling has been omitted entirely from the library's core. Assembly Lines don't try to catch any errors, and this was done in favor of creating a simple composable solution for finding errors in deeply nested assembly lines. Debugging async code is hard & time consuming. So a solution was designed to help narrow down thrown errors to the exact `BotAction`. This is done with a special type of `BotAction`, called `errors()()`.

`errors()()` wraps assembled `BotAction`'s in a try/catch, where errors caught are logged to the console with the Errors Block Name provided in the first `errors()` call. Let's see an example:

```typescript
await chain(
    errors('A specific error block name')(
        // actions to run in a wrapped try/catch:
        goTo('site to scrape'),
        // ... 
    ),
    log('this runs, even if errors()() catches an error')
)(page)
```
So if any actions in the assembled `errors()()` call throws an error, the error is caught by the `errors()()` `BotAction` and then logged to the console with the Error Block Name provided. After an error is thrown, the remaining assembled actions assembled are ignored (they don't run), but the higher order assembly-line continues.

`errors()()` checks the higher order context `injects` for a Pipe, and runs the assembled actions in a Pipe, only if a Pipe was detected. It tries to keep the style of assembly consistent.

Also, you can nest `errors()()` as deeply as you want. This is to help isolate, tough to find async bugs, in deeply nested assembly lines. Make sure to give each one an uniquely identifying Error Block Name, so you can identify where the error was caught. If a nested `errors()()` catches a thrown error, it swallows it, so higher level `errors()()` will not see it. This helps isolate bugs in the async functionality.

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
