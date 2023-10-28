import { test, expect } from './base-test';

test.describe('Broken Images', () => {
   
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/broken_images');
    });

    test('find broken images', async ({ page }) => {
       await page.waitForLoadState('domcontentloaded');
       const locatorImages = page.locator('img'); 

       const images = await locatorImages.all();
       for await (const image of images) {
        const src = await image.getAttribute('src');
        expect.soft(src?.length).toBeGreaterThan(1);

        if (src!.length > 1) {
            const response = await page.request.get('https://the-internet.herokuapp.com/' + src);
            if (response.status() !== 200) {
                expect(response.status()).toBe(404);
            }
        }
       }
    });
});

