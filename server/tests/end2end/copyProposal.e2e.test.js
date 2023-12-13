import { login, logout } from './utils';
import { Builder, By, until } from 'selenium-webdriver';

describe('End to end test for CopyProposal', () => {
    let driver;
    let clientUrl = 'http://localhost:5173';

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('professor can insert a new thesis proposal starting by an existing one', async () => {
        await login(driver, 'mario.rossi@polito.it', '10000');
        await driver.wait(until.urlIs(`${clientUrl}/teacher`));
        await driver.findElement(By.id('alert_Teacher successfully logged in'));
        await driver.sleep(1000);

        await driver.findElement(By.id('copy_27')).click();
        await driver.sleep(1000);
        await driver.wait(until.urlIs(`${clientUrl}/teacher/copyProposal/27`));
        await driver.sleep(1000);

        const title = await driver.findElement(By.id('title'));
        title.clear();
        await driver.sleep(500);
        title.sendKeys("test");

        await driver.findElement(By.id("copyProposalButton")).click();
        await driver.sleep(1000);

        await driver.wait(until.urlIs(`${clientUrl}/teacher`));

        await driver.findElement(By.id("alert_Copy Proposal"));
        console.log("Proposal update successfully");

        await logout(driver);
    });
});