import { Page, chromium } from '@playwright/test';
import _ from 'lodash';
import fs from 'fs';
import { mkDirByPathSync } from './file-helper';
import config from '../../../playwright.config';
import dotenv from 'dotenv';
import usersJson from '../data/users.json';

dotenv.config();

const env = process.env.APP_ENVIRONMENT;
const BASE_URL = config.use?.baseURL || 'http://example:8080';
const headless = process.env.HEADLESS || 'true';

export default class Authentication {

    private name!: string;

    setUser(name: string) {
        this.name = name;
    }
    
    getUser() {
        const users = _.cloneDeep(usersJson);
        if (!users) throw new Error('Users not found.');

        const user = users.find((user) => user.name === this.name);
        if (!user) throw new Error('User not found.');
        return user;
    }

    async getSession(page: Page) {
        const user = this.getUser();
        const filename = `tests/fixtures/session-storage/${env}.${user.username}.json`;

        const expiry = await this.getSessionFileTokenExpiry(filename);
        const valid = await this.isTokenValid(expiry);
        if (!valid) await this.loginToActiveDirectory(user.username);        
        await this.setSessionStorage(page, user.username);
        
    }

    async getSessionFileTokenExpiry(filename: string) {
        if (fs.existsSync(filename)) {
            const payload = JSON.parse(fs.readFileSync(filename, 'utf-8'));
            const idToken = Object.values(JSON.parse(payload))
              .map((value: any) => value.includes('idTokenClaims') ? JSON.parse(value) : 'exclude')
              .filter((token) => token.idTokenClaims);
            return (idToken.length > 0) ? idToken[0].idTokenClaims.exp : null;
          }
          return null;
    }
    
    async isTokenValid(expiry: any) {
        if ((!expiry) || (Date.now() >= expiry * 1000 - (5 * 60000))) return false;
        return true;
    }
    
    /* Login to active directory */
    async loginToActiveDirectory(username: string) {    
        const password = (username === 'admin') ? process.env.PASSWORD : process.env[`${username}`];
        if (password === undefined) {
            throw new Error(`[Debug] The password for ${username} can not be found.\n
                Please ensure ${username}=<password> has been set in .env if running locally.`);
        }
    
        const browser = await chromium.launch({
            headless: headless === 'true',
        });
        const context = await browser.newContext();
        const page = await context.newPage();    
        await page.goto(BASE_URL);
    
        // Enter the username and click the "Next" button
        await page.getByRole('textbox', { name: 'someone@example.com' }).fill(`${username}@onmicrosoft.com`);
        await page.getByRole('button', { name: 'Next' }).click();    
    
        // Enter password and click Sign In
        await page.waitForNavigation();        
        await page.getByPlaceholder('Password').fill(password);
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.getByRole('button', { name: 'Yes' }).click();
    
        // Wait for navigation to complete
        await page.waitForNavigation();
        await page.waitForSelector('data-testid=app-bar-username');
    
        // Write session into a file
        const sessionStorage: string = await page.evaluate(() => JSON.stringify(sessionStorage));
        fs.writeFileSync(`${mkDirByPathSync('tests/fixtures/session-storage')}/${env}.${username}.json`, JSON.stringify(sessionStorage));
        await browser.close();
    }
    
    async setSessionStorage(page: Page, username: string) {
    
        const filename = `tests/fixtures/session-storage/${env}.${username}.json`;
        const sessionStorage = JSON.parse(fs.readFileSync(filename, 'utf-8'));
      
        await page.context().addInitScript((storage: string) => {
          const entries = JSON.parse(storage);
          Object.keys(entries).forEach(key => {
            window.sessionStorage.setItem(key, entries[key]);
          });
        }, sessionStorage);
    }
}
