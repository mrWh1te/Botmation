# Dev Notes

Library Development
-------------------

This repo is managed with Nx. To get started, clone the repo and install npm dependencies.

Then build libraries (`core`, `instagram`, `linkedin`) with this command:
```
nx build <library name>
```

<img alt="Orange Bot" src="https://raw.githubusercontent.com/mrWh1te/Botmation/master/assets/art/orange_bot.PNG" width="175" align="right">

The [playground app](/apps/playground) is a dedicated spot for trying out new Bot Actions, etc. You can run it's code, after running the build command, with:

```
nx serve playground
```

Library Testing
---------------

All our testing (e2e, unit, and integration) is done with [Jest](https://jestjs.io/).

Learn more about the library's testing strategy and coverage with the [Botmation: Tests documentation](/notes/test.md).

Issues & Feature Requests
-------------------------

Open Issues on Github. Please specify if it's a feature request or a bug.

When reporting bugs, please provide sample code to recreate the bug, relevant error messages/logs, and any other information that may help.
