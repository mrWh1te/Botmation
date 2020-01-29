/**
 * @description   This Jest Testing is configured to use `http-server` in launching whatever is in `/tests/server` 
 *                as a sandbox website to run these tests locally against, when applicable
 */
describe('HTTP-Server used for Jest Testing', () => {

  // beforeAll(async () => {
    
    
  // })

  it('It should load, on port 8080, the main index.html file found in the ./src/tests/server/ directory', async () => {
    await page.goto('http://localhost:8080')
    await expect(page.title()).resolves.toMatch('Example Testing Page')
  })
  
})
