# TypeScript Source

Botmation's main TypeScript source code. After you build it, it will be transpiled in the `/build` directory from the root project folder.

## Overview

There's 3 main projects here. 

1) BotNation, which has not begun. It will be a web app tool for reporting and customizing/setup of the bots.
2) MationBot, is the main class that provides a declarative syntax to inject the tab, and potentially more, in the future, for our loosely coupled `BotAction`'s
3) Bots/ which has a folder for each website, this project is supporting. For example, we provide a "login()" `BotAction` for you to use, and a `isGuest` helper function so you can easily login with the special `ifThen` `BotAction`.