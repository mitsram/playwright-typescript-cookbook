import { test as base, Page } from '@playwright/test';
import BasePage from '../pages/base-page';

type TheInternetFixtures = {
    open: Open;
}

export const test = base.extend<TheInternetFixtures>({
    open: async ({ page }, use) => {
        await use(openFactory(page));
    }
});

export { expect } from '@playwright/test';

export type Open = <T extends BasePage> (type: { new(page: Page): T; }) => Promise<T>;
export const openFactory = (page: Page) =>
    async <T extends BasePage>(type: { new(page: Page): T; }): Promise<T> =>
        await (new type(page)).init();
