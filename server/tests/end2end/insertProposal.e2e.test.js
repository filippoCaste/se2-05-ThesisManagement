import { login, logout } from './utils';
import { Builder, By, until } from 'selenium-webdriver';

describe('professor can insert a new thesis proposal', () => {
    let driver;
    let clientUrl = 'http://localhost:5173';

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    const mockProposal = {
        title: 'test',
        description: 'test',
        type: 'test',
        expiration_date: '24/01/2024',
        notes: 'test'
    };

    test('professor can insert a new thesis proposal', async () => {
        await login(driver, 'mario.rossi@polito.it', '10000');
        await driver.wait(until.urlIs(`${clientUrl}/teacher`));
        await driver.findElement(By.id('alert_Teacher successfully logged in'));
        await driver.sleep(1000);

        await driver.findElement(By.id('addProposal')).click();
        await driver.sleep(1000);

        await driver.get(`${clientUrl}/teacher/addProposal`);
        await driver.sleep(1000);

        const title = await driver.findElement(By.id('title'));
        title.clear();
        await driver.sleep(500);
        title.sendKeys(mockProposal.title);

        const description = await driver.findElement(By.id('description'));
        description.clear();
        await driver.sleep(500);
        description.sendKeys(mockProposal.description);

        const type = await driver.findElement(By.id('type'));
        type.clear();
        await driver.sleep(500);
        type.sendKeys(mockProposal.type);

        await driver.findElement(By.id("level-select")).click();
        await driver.sleep(1000);
        await driver.findElement(By.id('MSc')).click();

        const selectDegree = await driver.findElement(By.id("select_degree"));
        await driver.wait(until.elementIsVisible(selectDegree));
        await driver.findElement(By.id("degree-select")).click();
        await driver.sleep(500);
        await driver.findElement(By.id("CYBERSECURITY")).click();
        await driver.sleep(500);
        await driver.findElement(By.id("addDegreeButton")).click();
        await driver.sleep(1000);

        const required_knowledge = await driver.findElement(By.id('required_knowledge'));
        required_knowledge.clear();
        await driver.sleep(500);
        required_knowledge.sendKeys(mockProposal.required_knowledge);

        await driver.findElement(By.id("keywords-select")).click();
        await driver.sleep(500);
        await driver.findElement(By.id("AI")).click();
        await driver.sleep(500);
        await driver.findElement(By.id("addKeywordButton"));
        await driver.sleep(1000);

        const notes = await driver.findElement(By.id('notes'));
        notes.clear();
        await driver.sleep(500);
        notes.sendKeys(mockProposal.notes);

        await driver.findElement(By.id("addProposalButton")).click();
        await driver.sleep(1000);

        await driver.wait(until.urlIs(`${clientUrl}/teacher`));

        await driver.findElement(By.id("alert_Added Proposal"));
        console.log("Proposal added successfully");

        await logout(driver);
    });

});
