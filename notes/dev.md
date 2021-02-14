# Dev Notes

> default Nx configuration is set to Node so short-hand syntax will generate a node based app or library

Build Library
-------------

This repo is managed with Nx. To get started, clone the repo and install npm dependencies.

Then build libraries (`core`, `instagram`, `linkedin`) with this command:
```bash
nx build <library name>
```

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

Test Library
------------

All our testing (e2e, unit, and integration) is done with [Jest](https://jestjs.io/).

Test the core library:
```bash
nx test core
```

Learn more about the library's testing strategy and coverage with the [Botmation: Tests documentation](/notes/test.md).

Development Server
------------------

Run `nx serve <app name>` for an app dev server for any example project. The app will automatically reload if you change any of the source files.

```bash
nx serve example
```

Any directory name in the `/apps` folder can be served with nx.

New Development Server
----------------------

Add a new application with a new name to setup a new development server. For example, an app called `acme`:
```bash
nx g app acme
```
