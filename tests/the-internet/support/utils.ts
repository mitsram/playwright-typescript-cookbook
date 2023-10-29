import { Locator } from '@playwright/test'; 

export async function locatorsToStrings(arrayLocators: Locator[]) {
    const arr: string[] = [];
    for (const locator of arrayLocators) {
        arr.push(await locator.innerText());
    }
    return arr;
}
