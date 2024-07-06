import { test, expect } from './base-test';

test.describe('Login', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('display products page when valid standard_user credential is entered', async ({ loginPage, productsPage }) => {
        await loginPage.loginAs('standard_user', 'secret_sauce');
        const title = await productsPage.getTitle();

        expect(title).toContainText('Products');
    });    

});