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
        console.log("File uploads successfully");

        await driver.sleep(1000);

        await logout(driver);
    });

    test('professor can access student CV', async () => {
        await login(driver, 'mario.rossi@polito.it', '10000');
        await driver.get(`${clientUrl}/teacher`);
        await driver.findElement(By.id('alert_Teacher successfully logged in'));
        await driver.sleep(1000);

        await driver.findElement(By.id('expandRow_Computer vision tecnique for mobile testing')).click();
        await driver.sleep(1000);

        await driver.findElement(By.id('19')).click();
        await driver.sleep(1000);

        await driver.findElement(By.id('showMoreButton_19')).click();
        await driver.sleep(1000);

        const button = await driver.findElement(By.id('showCV')).isEnabled();
        expect(button).toBe(true);
        console.log("Professor can see student CV");

        await driver.sleep(1000);
        await logout(driver);

    });
});