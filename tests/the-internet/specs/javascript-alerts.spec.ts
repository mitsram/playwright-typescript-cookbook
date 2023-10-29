import { test, expect } from './base-test';

test.describe('Javascript Alerts', () => {
   
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    })
    
    test('message displayed when alert is triggered', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('I am a JS Alert');
            await dialog.accept();
        });
        await page.getByText('Click for JS Alert').click();

        const result = await page.locator('id=result').innerText();
        expect(result).toEqual('You successfully clicked an alert');
    });

    test('return ok when confirmation is accepted', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('I am a JS Confirm');
            await dialog.accept();
        });
        await page.getByText('Click for JS Confirm').click();

        const result = await page.locator('id=result').innerText();
        expect(result).toEqual('You clicked: Ok');
    });

    test('return cancel when confirmed is dismissed', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('I am a JS Confirm');
            await dialog.dismiss();
        });
        await page.getByText('Click for JS Confirm').click();

        const result = await page.locator('id=result').innerText();
        expect(result).toEqual('You clicked: Cancel');
    });

    test('return entered text when prompt is accepted', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('I am a JS prompt');
            await dialog.accept('Pizza');
        });
        await page.getByText('Click for JS Prompt').click();

        const result = await page.locator('id=result').innerText();
        expect(result).toEqual('You entered: Pizza');
    });
    
    test('return null when prompt is dismissed', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('I am a JS prompt');
            await dialog.dismiss();
        });
        await page.getByText('Click for JS Prompt').click();

        const result = await page.locator('id=result').innerText();
        expect(result).toEqual('You entered: null');
    });
});
