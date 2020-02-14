<h1>Botmation: Actions</h1>

Bot Actions are async functions that operate on a Puppeteer's `page` with `BotOptions` and optionally `injects` (for whatever is needed).

Bot Action Interface
--------------------
```typescript
export interface BotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<void>
}
```
> Note: While the function requires options, devs do not need to provide it, when using either the `BotActionsChainFactory` or the `Botmation` class. A safe set of defaults are provided instead. You may overload that with only what you need.

These functions are created from higher order functions called `BotActionFactory` functions. A factory returns a `BotAction` function. This enables devs to use factory functions to customize Bot Actions with whatever is needed.

Bot Action Factory Interface
----------------------------
```typescript
export interface BotActionFactory extends Function {
  (...args: any[]) : BotAction
}
```


# API Reference

As of v1.0.0, there are 6 types of bot actions.

1. Console
2. Cookies
3. Input
4. Navigation
5. Output
6. Utilities

## Console

