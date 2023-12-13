"use strict";

const { By, until } = require("selenium-webdriver");

const clientUrl = "http://localhost:5173";

module.exports = {
    login: async (driver, email, password) => {
        await driver.get(clientUrl);
        await driver.wait(until.urlIs('https://thesis-management-05.eu.auth0.com/u/login?state=hKFo2SBUSE1ydm9zTjByczJqejhrRHJTWGV0YlFDS1Q2Z2FKTaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGRndmFoYi1HOEF6OW0yTVZCT3daZGRhNzZjaVJGOWZFo2NpZNkgYUxKbWNNa0RKa3BjOFJxbDhFZnhMVmw0TkQ5YVV5V3A'));

        const emailBox = await driver.findElement(By.id("username"));
        emailBox.clear();
        await driver.sleep(500);
        emailBox.sendKeys(email);

        const passwordBox = await driver.findElement(By.id("password"));
        passwordBox.clear();
        await driver.sleep(500);
        passwordBox.sendKeys(password);

        await driver.sleep(2000);

        const loginButton = await driver.findElement(By.name("action"));
        loginButton.click();

        await driver.sleep(500);
    },

    logout: async (driver) => {
        await driver.get(clientUrl);
        await driver.sleep(1000);

        const dropdown = await driver.findElement(By.id("primary-search-account-menu"));
        dropdown.click();

        await driver.sleep(1000);

        const logoutButton = await driver.findElement(By.id("iconButtonLogout"));
        logoutButton.click();

        await driver.sleep(1000);
    }
};