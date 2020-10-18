## [v3.0.0](https://github.com/mrWh1te/Botmation/releases/tag/3.0.0)

Working with latest Puppeteer version 5.

### Features
 - Resolved a blocking issue with E2E testing
 - Slimmer package size (Unpacked 2.57MB -> 450kB)

## [v2.0.1](https://github.com/mrWh1te/Botmation/releases/tag/2.0.1)

New Docs Site published with updated README's for better distribution.

[https://botmation.dev](https://botmation.dev)

### Features
 - Getting Started guides, advanced topics reviewed, and detailed API docs
 - No source code changes

# [v2.0.0](https://github.com/mrWh1te/Botmation/releases/tag/2.0.0)

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