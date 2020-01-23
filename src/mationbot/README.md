# MationBot Class

The main class that encapsulates Puppeteer's page as the active tab, to crawl and interact in.

It provides a most useful declarative method called `actions()` which runs a comma-delimited list, in sequence, of async functions known as `BotAction`'s.

More docs coming in the future

I suggest looking at the example, currently implemented in `src/index.ts` that logs into Instagram, with nested lists of actions, which this system currently supports.