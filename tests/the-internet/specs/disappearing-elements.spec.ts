import { Locator } from '@playwright/test';
import { test, expect  } from './base-test';
import _ from 'lodash';

async function locatorsToStrings(arrayLocators: Locator[]) {
    const arr: string[] = [];
    for (const locator of arrayLocators) {
        arr.push(await locator.innerText());
    }
    return arr;
}

test.describe('Disappearing Elements', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/disappearing_elements');
    });

    test('detect disappeared/reappeared elements', async ({ page }) => {
        const numOfReload = 4;
        await page.waitForLoadState('domcontentloaded');
       let fromList = await locatorsToStrings(await page.locator('li').all());

       for (let i = 0; i < numOfReload; i++ ) {
            await page.reload();
            await page.waitForLoadState('domcontentloaded');

            const newList = await locatorsToStrings(await page.locator('li').all());
            let difference: string[] = [];
            (newList > fromList) ? difference = _.difference(newList, fromList) : difference = _.difference(fromList, newList);
            
            if (difference.length > 0) {
                expect(fromList).not.toEqual(newList);
                difference.forEach((d) => console.log(`[Reload ${i}] - The difference is ${d}`));
            }            
            fromList = newList;
       }
    });   
});
