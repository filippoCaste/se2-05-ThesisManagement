import { Builder, By, until } from 'selenium-webdriver';

let driver;

const doLogin = async (username, password, role) => {
    await driver.get("https://thesis-management-05.eu.auth0.com/u/login?state=hKFo2SB6Mkp6WnhDSzA0YWFuS3hweEdnU2o1eVVYeUFiWVlhS6Fur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGNYeGl5b1RfeGlGZzQxVmlYVXIwUkN3TkJsemRFTkdUo2NpZNkgYUxKbWNNa0RKa3BjOFJxbDhFZnhMVmw0TkQ5YVV5V3A");
    await driver.findElement(By.id('login')).click();
    await driver.findElement(By.id('email')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.type('submit')).click();
    await driver.get('http://localhost:5173/' + role);
};

describe('Student can see thesis proposal and details of the proosals', () => {

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Student can see thesis proposal', async () => {
    const table = await driver.findElement(By.id('table'));
    expect(table).toBeTruthy();
  });

  test('Student can see details of the proposal', async () => {
    
  });

});
