import { login, logout } from './utils';
import { Builder, By, until } from 'selenium-webdriver';

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
        await driver.findElement(By.id('alert_Student successfully logged in'));

        await driver.findElement(By.id('showButton0')).click();
        await driver.wait(until.elementLocated(By.id('uploadCVButton'))).click();

        const fileInput = await driver.findElement(By.id('uploadCVInput'));
        await fileInput.sendKeys('C:\\Users\\giova\\Downloads\\s318082_20_CV.pdf');

        await driver.wait(until.elementLocated(By.id('selectedFile')));
        await driver.findElement(By.id('applyButton')).click();

        await driver.wait(until.elementLocated(By.id('alert_Successfully Applied')));
        console.log("File uploaded successfully");

        await logout(driver);
    });

    test('professor can access student CV', async () => {
        await login(driver, 'mario.rossi@polito.it', '10000');
        await driver.get(`${clientUrl}/teacher`);
        await driver.findElement(By.id('alert_Teacher successfully logged in'));

        await driver.findElement(By.id('expandRow_Computer vision tecnique for mobile testing')).click();
        await driver.findElement(By.id('19')).click();
        await driver.findElement(By.id('showMoreButton_19')).click();

        const isButtonEnabled = await driver.findElement(By.id('showCV')).isEnabled();
        expect(isButtonEnabled).toBe(true);
        console.log("Professor can see student CV");

        await logout(driver);
    });
});
