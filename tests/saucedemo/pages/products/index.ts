import { Locator } from "@playwright/test";
import BasePage from "../base-page";


export default class ProductsPage extends BasePage {

    async init(): Promise<this> {
        return this;
    }


    async searchProduct(productName: string) {
        
    }

    async getTitle() : Promise<Locator> {
        return this.page.locator('.title');
    }
}