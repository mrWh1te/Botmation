<h1>Botmation: Tests</h1>

Given this is a library, testing is very important. 

It's all done by Jest and found in this directory `/src/test`.

Unit-Tests
------------
Every Bot Action Factory, except `wait()`, is covered with unit-testing. 

Integration Tests
-----------------
Every Bot Action that uses one or more of Puppeteer's Page's public methods, has an Integration test included.

End-to-End Tests
----------------
The class and main factory have E2E tests, running in puppeteer. This is to be sure the class and factory are always working.

Testing Scaffolding
-------------------
The `/src/tests/botmation` directory follows a 1:1 mapping with the `/src/botmation` directory, as to where each files' tests are.