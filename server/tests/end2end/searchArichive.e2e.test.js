import { login, logout } from './utils';
import { Builder, By, until } from 'selenium-webdriver';

describe('End to end test for SearchArchive', () => {
    let driver;
    let clientUrl = 'http://localhost:5173';

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('professor can search in the archive', async () => {
        await login(driver, 'mario.rossi@polito.it', '10000');
        await driver.wait(until.urlIs(`${clientUrl}/teacher`));
        await driver.findElement(By.id('alert_Teacher successfully logged in'));
        await driver.sleep(1000);

        await driver.findElement(By.id('archive-radio')).click();
        await driver.sleep(1000);

        const table = await driver.findElement(By.id('archive-table'));
        const rows = await table.findElements(By.className('proposal-row'));
        for (let i = 1; i < rows.length; i++) {
            const status = await rows[i].findElement(By.id('status-row')).getText();
            expect(status).toEqual('archived');
        }

        console.log("Search in the archive successfully");

        await logout(driver);
    });
});