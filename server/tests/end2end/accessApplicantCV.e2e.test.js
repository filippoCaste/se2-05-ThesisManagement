const request = require('supertest');
const app = require('../../index');

const { login, logout } = require('./utils');
const { Builder, By, until } = require('selenium-webdriver');

describe('End to end test for AccessApplicantCV', () => {
    let driver;
    let clientUrl = 'http://localhost:5173';

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('student can upload CV', async () => {
        await login(driver, 's318082@studenti.polito.it', '318082');
        await driver.get(`${clientUrl}/student`);
        await driver.sleep(1000);

        await driver.findElement(By.id('showButton0')).click();
        await driver.sleep(1000);

        const uploadButton = await driver.findElement(By.id('uploadCVButton')).click();
        await driver.sleep(1000);

        uploadButton.sendKeys('C:\\Users\\giova\\Downloads\\s318082_19.pdf');

        await driver.sleep(1000);

        await driver.wait(until.elementIsVisible('selectedFile'));

        await driver.sleep(1000);

        await driver.findElement(By.id('applyButton')).click();

        await driver.sleep(1000);

        await driver.findElement(By.id('alert_Successfully Applied')).click();

        await driver.sleep(1000);

        await logout(driver);
    });

    test('professor can access student CV', async () => {
        await login(driver, 'mario.rossi@polito.it', '10000');
        await driver.get(`${clientUrl}/teacher`);
        await driver.sleep(1000);

        await driver.findElement(By.id('expandRow_Computer vision tecnique for mobile testing')).click();
        await driver.sleep(1000);

        await driver.findElement(By.id('19')).click();
        await driver.sleep(1000);

        await driver.findElement(By.id('showMoreButton_19')).click();
        await driver.sleep(1000);

        const button = await driver.findElement(By.id('showCV')).isEnabled();
        expect(button).toBe(true);

        await driver.sleep(1000);
        await logout(driver);

    });
});
