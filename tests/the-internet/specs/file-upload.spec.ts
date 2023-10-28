import { test, expect } from './base-test';

test.describe('File Upload', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/upload');
    });
    
    test('upload successful when file is valid', async ({ page }) => {
        await page.setInputFiles('#file-upload', 'tests/the-internet/fixtures/assets/laptop.jpeg');
        await page.locator('#file-submit').click();

        const uploadedFiles = await page.locator('#uploaded-files').textContent();
        expect(uploadedFiles).toContain('laptop.jpeg');
    });
});
