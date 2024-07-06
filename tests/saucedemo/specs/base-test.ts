import { test as base, Page } from '@playwright/test';
import BasePage from '../pages/base-page';
import {
    LoginPage,
    ProductsPage
} from '../pages/index'

type SauceDemoFixtures = {
    open: Open;
    loginPage: LoginPage;
    productsPage: ProductsPage;
}

export const test = base.extend<SauceDemoFixtures>({
    open: async ({ page }, use) => {
        await use(openFactory(page));
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    }
});

export { expect } from '@playwright/test';

export type Open = <T extends BasePage> (type: { new(page: Page): T; }) => Promise<T>;
export const openFactory = (page: Page) =>
    async <T extends BasePage>(type: { new(page: Page): T; }): Promise<T> =>
        await (new type(page)).init();
