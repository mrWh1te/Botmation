<h1>Botmation: Tests</h1>

Testing is very important to this project. We are aiming for 100% test coverage.

It's all being handled by Jest and found in this directory `/src/test`. All the tests have a local http server running and Puppeteer to facilitate consistent tests.

The strategy is to minimize effort while maximizing coverage with meaninful tests. So integration tests for Puppeteer's methods within the Bot Actions. For unique functionality provided by a Bot Action, unit tests are provided. 

As per the main OOP class and the Functional approach, there are E2E tests, running, with Puppeteer. We run the library code, then rely directly on Puppeteer's code, in these E2E tests, to verify our results.

Unit-Tests
------------
Every Bot Action Factory is covered with unit-testing to verify unique functionality with some extra padding, since it overlaps some testing done in the Puppeteer project. Therefore the primary focus is unit-testing unique functionality like the utility Bot Actions. 

One Bot Action Factory `wait` (see [Issue #8](/issues/8)) lacks testing.

Integration Tests
-----------------
Every Bot Action that uses one or more of Puppeteer's Page's public methods, has Integration tests included, to be sure we are always using Puppeteer's page's public methods correctly. 

End-to-End Tests
----------------
The class and main factory have E2E tests, running in Puppeteer. This is to be sure the class and factory are always working with our automated dependency strategy. We use Puppeteer code to verify the results of running Bot Actions in `Botmation` or `BotActionsChainFactory`.

Testing Scaffolding
-------------------
The `/src/tests/botmation` directory follows a 1:1 mapping with the `/src/botmation` directory, as to where each files' tests are. In addition, there is a test to verify the working of the `http-server` that Jest is configured to boot up, to run some of these tests against. So Puppeteer, in some tests, will load a localhost site, served from `/src/tests/server`.