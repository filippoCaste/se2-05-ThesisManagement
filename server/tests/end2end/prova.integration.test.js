import { Builder, By, until } from 'selenium-webdriver';

async function runEndToEndTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:5173/');
    await driver.wait(until.urlContains('https://thesis-management-05.eu.auth0.com/u/login?state=hKFo2SBiM011TzNJZGNJQXBISFdVZmNpczc4NWR6RnFuVlpSOKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDEwdDh0Tjd1YU5FaENSU2F1NmE2MHFyb1RvSkh1WmpQo2NpZNkgYUxKbWNNa0RKa3BjOFJxbDhFZnhMVmw0TkQ5YVV5V3A'));

    const elementoUsername = await driver.findElement(By.id('username'));
    const elementoPassword = await driver.findElement(By.id('password'));

    console.log('Test completato con successo!');

  } finally {
    await driver.quit();
  }
}

runEndToEndTest();
