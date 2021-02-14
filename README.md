<img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/banner/1556x379v2.png" alt="Botmation Crew" width="474">

[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation)
[![Known Vulnerabilities](https://snyk.io/test/github/mrWh1te/Botmation/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mrWh1te/Botmation?targetFile=package.json)
[![codecov](https://img.shields.io/codecov/c/github/mrWh1te/Botmation/master?label=codecov)](https://codecov.io/gh/mrWh1te/Botmation)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrWh1te_Botmation&metric=alert_status)](https://sonarcloud.io/dashboard?id=mrWh1te_Botmation)
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation)
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

# Introduction

[Botmation](https://botmation.dev) is a simple declarative framework for building bots in TypeScript using [Puppeteer](https://github.com/puppeteer/puppeteer). It follows a simple, composable pattern focused on a single type of function called a BotAction. 

BotActions do everything, from simple tasks in crawling and scraping the web, to logging in & automating social media. They are composable, so they are easily assembled.

The possibilities are endless!

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

Why choose Botmation?
---------------------

<img alt="Baby Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/baby_bot.PNG" width="125" align="right">

It empowers Puppeteer code with a simple pattern to maximize code readability, reusability and testability.

Its compositional design comes pre-built with safe defaults for building bots with less code.

It encourages a learn at your own pace approach to exploring the possibilities of Functional programming.

It has 100% source code test coverage.

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need [node.js](http://nodejs.org/) LTS installed and the TypeScript compiler (`tsc`) installed globally (or have a transpiling code step).

Install
-------

To get started, install Botmation's main package with `npm`:

<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

    npm install --save @botmation/core

If you're just getting started, install `puppeteer`:

    npm install --save puppeteer 

You can install any other [@botmation packages](https://www.npmjs.com/org/botmation) to extend upon the available functionality:

    npm install --save @botmation/instagram

Documentation
-------------

For getting started, API docs of *all* packages with examples, visit [Botmation's Documentation](https://botmation.dev/).

Core Library Reference
----------------------

`@botmation/core` is the main package consisting of all functions in the API of [Botmation docs](https://botmation/dev./). It has the foundational functions for building bots and a little more. Other packages, like `@botmation/instagram` have specific functions that work in conjunction with the core ones.

Import any core API function from:
```javascript
import { chain, goTo, screenshot } from '@botmation/core'
```

`@botmation/core` v1 has 14 groups of BotActions to choose from:

<img alt="Leader Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/red_bot.PNG" width="200" align="right" style="position: relative;top: 30px;">

 - [abort](https://www.botmation.dev/api/abort)
    - abort an assembly of `BotAction`'s
 - [assembly-line](https://www.botmation.dev/api/assembly-lines)
    - compose and run `BotAction`'s in lines
 - [console](https://www.botmation.dev/api/console)
    - log messages to the nodeJS console
 - [cookies](https://www.botmation.dev/api/cookies)
    - read/write page cookies
 - [errors](https://www.botmation.dev/api/errors)
    - try/catch errors in assembly-lines
 - [files](https://www.botmation.dev/api/files)
    - write files to local disk ie screenshots, pdf's
 - [indexed-db](https://www.botmation.dev/api/indexed-db)
    - read/write to page's IndexedDB
 - [inject](https://www.botmation.dev/api/inject)
    - insert new injects into a line of `BotAction`'s
 - [input](https://www.botmation.dev/api/input)
    - simulate User input ie typing and clicking with a mouse
 - [local-storage](https://www.botmation.dev/api/local-storage)
    - read/write/delete from a page's Local Storage
 - [navigation](https://www.botmation.dev/api/navigation)
    - change the page's URL, wait for form submissions to change page URL, back, forward, refresh
 - [pipe](https://www.botmation.dev/api/pipe)
    - functions specific to Piping
 - [scrapers](https://www.botmation.dev/api/scrapers)
    - scrape HTML documents with an HTML parser and evaluate JavaScript inside a Page
 - [utilities](https://www.botmation.dev/api/utilties)
    - handle more complex logic patterns ie if statements and for loops

Contributors
------------

### Code

[Michael Lage](https://github.com/mrWh1te) - [Blog](https://lage.tech)

### Art

[Patrick Capeto](https://www.instagram.com/patrick.capeto/) - [Email](mailto:me@patrickcapeto.com)
