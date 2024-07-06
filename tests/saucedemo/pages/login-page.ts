import { Locator, Page } from "@playwright/test";
import BasePage from "./base-page";

export default class LoginPage extends BasePage {

    readonly usernameTextBox: Locator;
    readonly passwordTextBox: Locator;
    readonly loginButton: Locator;


    constructor(page: Page) {
        super(page);
        this.usernameTextBox = page.getByPlaceholder('Username');
        this.passwordTextBox = page.getByPlaceholder('Password');
        this.loginButton = page.locator('#login-button');
    }

    async init(): Promise<this> {
        return this;
    }

    public async loginAs(username: string, password: string) {
        await this.usernameTextBox.fill(username);
        await this.passwordTextBox.fill(password);
        await this.loginButton.click();
    }
}