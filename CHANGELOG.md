## v1.1.0 @botmation/core

New `schedule()` BotAction, reorganization of BotAction groups (Utilities => Time, Loops, Branching) and minor performance improvement of a few core BotActions.

## [v1.0.0](https://github.com/mrWh1te/Botmation/releases/tag/1.0.0) @botmation/*

This release includes a repo refactor, to rely on the amazing [Nx](https://nx.dev) tool to manage the "neighborhood" of applications ("houses") and libraries ("house parts") that Botmation consists of. With this, a new [@botmation](https://www.npmjs.com/org/botmation) organization has been filed with the npm registry and the following packages have been released:

- [@botmation/core](https://www.npmjs.com/package/@botmation/core)
- [@botmation/instagram](https://www.npmjs.com/package/@botmation/instagram)
- [@botmation/linkedin](https://www.npmjs.com/package/@botmation/linkedin)

[@botmation/core](https://www.npmjs.com/package/@botmation/core) v1.0.0 is a re-release of [botmation](https://www.npmjs.com/package/botmation) v3.0.0

To upgrade from the original [botmation](https://www.npmjs.com/package/botmation) package to the new [@botmation/core](https://www.npmjs.com/package/@botmation/core), do the following:
1. [Update](https://docs.npmjs.com/cli/v6/commands/npm-update) the project to the latest Puppeteer v7.1.0
2. Uninstall the [@types/puppeteer](https://www.npmjs.com/package/@types/puppeteer) package (Puppeteer v6 and up includes TS types)
3. Replace [botmation](https://www.npmjs.com/package/botmation) with [@botmation/core](https://www.npmjs.com/package/@botmation/core)
    1. [Uninstall](https://docs.npmjs.com/cli/v6/commands/npm-uninstall) [botmation](https://www.npmjs.com/package/botmation)
    2. [Install](https://docs.npmjs.com/cli/v6/commands/npm-install) [@botmation/core](https://www.npmjs.com/package/@botmation/core)
    3. update `import {...} from 'botmation'` statements to `import {...} from '@botmation/core'`

If these out-of-order Github Tags confuse, please accept our apologies. The Tags were originally associated with the [botmation](https://www.npmjs.com/package/botmation) npm package, but now refer to all published npm packages under the new [@botmation](https://www.npmjs.com/org/botmation) organization.

The Github Tags will be updated on major API breaking changes, following [semantic versioning](https://docs.npmjs.com/about-semantic-versioning). Therefore these tagged Github releases will begin skipping minor and patch updates.

# Deprecated `botmation` releases

The following Tagged Releases pertain to the original [botmation](https://www.npmjs.com/package/botmation) npm package which has been replaced with [@botmation/core](https://www.npmjs.com/package/@botmation/core).

## [v3.0.0](https://github.com/mrWh1te/Botmation/releases/tag/3.0.0)

- Updated to work with latest Puppeteer version 5.

### Features
 - Resolved a blocking issue with E2E testing
 - Slimmer package size (Unpacked 2.57MB -> 450kB)

## [v2.0.1](https://github.com/mrWh1te/Botmation/releases/tag/2.0.1)

New Docs Site published with updated README's for better distribution.

[https://botmation.dev](https://botmation.dev)

### Features
 - Getting Started guides, advanced topics reviewed, and detailed API docs
 - No source code changes

## [v2.0.0](https://github.com/mrWh1te/Botmation/releases/tag/2.0.0)

### Features
 - A fully composable design
 - 12 types of `BotAction`'s
 - 100% library source test coverage
 - Added ability to Pipe BotAction's

### Bug Fixes

### Code Refactors
 - Reduces `BotAction` parameters
 - Standardize the `injects` system
 - Assembling BotAction's via `Factories` replaced with `Assembly Lines`

### Performance Improvements
 - Assembled BotAction's of length 1 resolves faster

### Breaking Changes
 - All uses of `BotActionsChainFactory()` is replaced with `chain()` BotAction
