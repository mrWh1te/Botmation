<img src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/banner/1556x379v2.png" alt="Botmation Crew" width="474">

[![npm](https://img.shields.io/npm/v/botmation)](https://www.npmjs.com/package/botmation)
[![Build Status](https://travis-ci.com/mrWh1te/Botmation.svg?branch=master)](https://travis-ci.com/mrWh1te/Botmation)
[![Known Vulnerabilities](https://snyk.io/test/github/mrWh1te/Botmation/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mrWh1te/Botmation?targetFile=package.json)
[![codecov](https://img.shields.io/codecov/c/github/mrWh1te/Botmation/master?label=codecov)](https://codecov.io/gh/mrWh1te/Botmation)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrWh1te_Botmation&metric=alert_status)](https://sonarcloud.io/dashboard?id=mrWh1te_Botmation)
[![dependencies Status](https://david-dm.org/mrWh1te/Botmation/status.svg)](https://david-dm.org/mrWh1te/Botmation)
![GitHub](https://img.shields.io/github/license/mrWh1te/Botmation)

[Botmation](https://botmation.dev) is a simple TypeScript framework to build web bots with [Puppeteer](https://github.com/puppeteer/puppeteer) in a declarative, functional and composable way.

> “Everything should be made as simple as possible, but no simpler.” - Albert Einstein

Why choose Botmation?
---------------------

<img alt="Baby Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/baby_bot.PNG" width="125" align="right">

It empowers Puppeteer code with a simple pattern to maximize code readability, reusability and testability.

Its compositional design comes pre-built with safe defaults for building bots with less code.

It encourages a learn at your own pace approach to exploring the possibilities of Functional programming.

It has 100% source code test coverage.

# Introduction

[Botmation](https://botmation.dev) is simple declarative framework for [Puppeteer](https://github.com/puppeteer/puppeteer), to build web bots in a composable way. It provides a simple pattern focused on a single type of function called `BotAction`. 

`BotAction`'s handle everything from simple tasks in crawling and scraping the web to logging in & automating your social media. They are composable. They make assembling Bots easy, declarative, and simple.

The possibilities are endless!

# Getting Started

Botmation is a NodeJS library written in TypeScript. You'll need [node.js](http://nodejs.org/) LTS installed and the TypeScript compiler (`tsc`) installed globally (or have a transpiling code step).

<img alt="Yellow Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/yellow_bot.PNG" width="175" align="right">

Install
-------

To get started, install Botmation's main package with `npm`:

    npm install --save @botmation/core

If you're just getting started, install `puppeteer`:

    npm install --save puppeteer 

You can install site specific packages with `npm`:

    npm install --save @botmation/instagram

Library Reference
-----------------

`@botmation/core` is the main package used every-time. It has the foundational functions for building bots. Other packages, like `@botmation/instagram` have specific functions that work with the main ones from Core.

After intalling through `npm`, import functions from their respective packages:
```javascript
import { chain, goTo, screenshot } from '@botmation/core'
import { login } from '@botmation/instagram'
```

`@botmation/core` v1 has 14 groups of `BotAction` to choose from: 

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

Documentation
-------------

To get a complete picture of Botmation, learn about its design and pattern, view API Doc's, see examples, advanced techniques, and a tutorial on approaching these Bot problems, visit the [official Botmation Documentation](https://botmation.dev) site.

Contributors
------------

### Code

[Michael Lage](https://github.com/mrWh1te) - [Blog](https://copynpaste.me)

### Art

[Patrick Capeto](https://www.instagram.com/patrick.capeto/) - [Email](mailto:me@patrickcapeto.com)
