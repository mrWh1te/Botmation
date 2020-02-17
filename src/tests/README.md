<h1>Botmation: Tests</h1>

Testing is very important to this project.

It's all being handled by Jest and found in this directory `/src/test`.

The strategy is to write integration tests for using Puppeteer's methods within the bot actions, relying on that project to unit-test their functions. But for unique functionality provided, and for greater coverage, many bot actions have unit tests. It also helps with our automated strategy of keeping up to date with dependencies through Greenkeeper & Mergify.

As per the main OOP class and the Functional approach, there are E2E tests, running, with Puppeteer. We test our code, then rely directly on Puppeteer's code, in these E2E tests to verify our results.

Unit-Tests
------------
Every Bot Action Factory is covered with unit-testing. The one exception currently is for `wait()` (see Issue #8).

Integration Tests
-----------------
Every Bot Action that uses one or more of Puppeteer's Page's public methods, has Integration tests included, to be sure we are using Puppeteer's page's methods correctly. 

End-to-End Tests
----------------
The class and main factory have E2E tests, running in Puppeteer. This is to be sure the class and factory are always working with our automated dependency strategy.

Testing Scaffolding
-------------------
The `/src/tests/botmation` directory follows a 1:1 mapping with the `/src/botmation` directory, as to where each files' tests are. In addition, there is a test to verify the working of the `http-server` that Jest is configured to boot up, to run some of these tests against. So Puppeteer, in some tests, will load a localhost site, from `/src/tests/server`.