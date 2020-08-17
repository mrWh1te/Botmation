<img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/banner/1556x379v2.png" alt="Botmation Crew" width="474">

[![npm](https://img.shields.io/npm/v/botmation)](https://www.npmjs.com/package/botmation)
[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation)
[![codecov](https://img.shields.io/codecov/c/github/mrWh1te/Botmation/master?label=codecov)](https://codecov.io/gh/mrWh1te/Botmation)
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation)
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

[Botmation](https://botmation.dev) is a TypeScript library for using [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative, functional and composable way.

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

<img alt="Baby Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/baby_bot.PNG" width="125" align="right" style="position:relative;top:60px">

Why choose Botmation?
---------------------

It empowers Puppeteer code with a simple pattern that maximizes code readability, reusability and testability.

It has a compositional design with safe defaults for building bots with less code.

It encourages learning at your own pace, to inspire an appreciation for the possibilities of Functional programming.

It has 100% library code test coverage.

# Introduction

[Botmation](https://botmation.dev) is simple functional framework for [Puppeteer](https://github.com/puppeteer/puppeteer) to build online Bots in a composable, testable, and declarative way. It provides a simple pattern focused on a single type of function called `BotAction`. 

`BotAction`'s handle almost everything from simple tasks in crawling and scraping the web to logging in & automating your social media. They are composable. They make assembling Bots easy, declarative, and simple.

You can compose new `BotAction`'s from ones provided or build your own from scratch, then mix them up.

The possibilities are endless!

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need [node.js](http://nodejs.org/) LTS installed and the TypeScript compiler (`tsc`) installed globally (or have a transpiling code step).

<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

Install
-------

Install Botmation with `npm` and save it as a dependency:

    npm install -s botmation

If you're just getting started, install `puppeteer` latest v2 & `@types/puppeteer` v3.0.0:

    npm install -s puppeteer@">=2.0.0 <3.0.0" @types/puppeteer@3.0.0

While `Botmation` source code works with Puppeteer version 3, 4, and 5, the E2E testing has a bug that is limiting the packaging, as of this moment.

> If you want to use Botmation with the latest Puppeteer version, for now, clone the repo locally and work from the playground bot. From there you can install the latest `@types/puppeteer` and `puppeteer` packages then build Botmation source code with it. But, be wary, the E2E tests will become rather unstable.

Documentation
-------------

To get started with Botmation, learn about its design and pattern, view API Doc's, see examples, advanced techniques, and a tutorial on approaching these Bot problems, visit the [official Botmation Documentation](https://botmation.dev) site.

Library Reference
-----------------

After intalling through `npm`, import any `BotAction` from the main module: 
```javascript
import { chain, goTo, screenshot } from 'botmation'
```

As of v2.0.x, there are 12 groups of `BotAction` to compose with: 

<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="200" align="right" style="position: relative;top: 30px;">

 - [assembly-line](https://www.botmation.dev/botaction/assembly-lines)
    - compose and run `BotAction`'s in lines
 - [console](https://www.botmation.dev/botaction/console)
    - log messages to the nodeJS console
 - [cookies](https://www.botmation.dev/botaction/cookies)
    - read/write page cookies
 - [errors](https://www.botmation.dev/botaction/errors)
    - try/catch errors in assembly-lines
 - [files](https://www.botmation.dev/botaction/files)
    - write files to local disk ie screenshots, pdf's
 - [indexed-db](https://www.botmation.dev/botaction/indexed-db)
    - read/write to page's IndexedDB
 - [inject](https://www.botmation.dev/botaction/inject)
    - insert new injects into a line of `BotAction`'s
 - [input](https://www.botmation.dev/botaction/input)
    - simulate User input ie typing and clicking with a mouse
 - [local-storage](https://www.botmation.dev/botaction/local-storage)
    - read/write/delete from a page's Local Storage
 - [navigation](https://www.botmation.dev/botaction/navigation)
    - change the page's URL, wait for form submissions to change page URL, back, forward, refresh
 - [utilities](https://www.botmation.dev/botaction/utilties)
    - handle more complex logic patterns ie if statements and for loops

Examples
--------

In the `./src/examples` [directory](/src/examples) of this repo (excluded from the npm module), exists a small collection of simple bots, to help you get going:
 - [Simple Object-Oriented](/src/examples/simple_objectoriented.ts)
 - [Simple Functional](/src/examples/simple_functional.ts)
 - [Generate Screenshots](/src/examples/screenshots.ts)
 - [Save a PDF](/src/examples/pdf.ts)
 - [Instagram Login](/src/examples/instagram.ts)

# Dev Notes

Library Development
-------------------

First, clone the repo locally, then install the npm dependencies. You can build the library locally with this command:
```
npm run build
```

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

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
