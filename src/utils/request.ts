import * as vscode from 'vscode';
import axios from 'axios';
import { JSDOM } from 'jsdom';

import { getCookieObject, CookieObject } from './helper';

const base: string = 'https://adventofcode.com';

export async function fetchDescription(year: number, day: number): Promise<string> {
    const { data, status, statusText } = await axios.get(`/${year}/day/${day}`, {
        baseURL: base,
        responseType: 'document',
        ...(await getCookieObject()),
    });

    if (status === 200) {
        const dom = new JSDOM(data);
        const dayDesc = dom.window.document.body.getElementsByClassName('day-desc');

        // TODO: cache data

        /// loading all parts if logged in & part 1 completed
        let html = '';
        for (let i = 0; i < dayDesc.length; i++) {
            html += `<details open><summary>Part ${i + 1}</summary>${dayDesc[i].innerHTML}</details>`;
        }
        return html;
    }
    return statusText;
}


export async function fetchData(year: number, day: number): Promise<string | undefined> {
    const cookieObject: CookieObject = await getCookieObject();
    if (cookieObject.headers === undefined) {
        return undefined;
    }

    const { data, status } = await axios.get(`/${year}/day/${day}/input`, {
        baseURL: base,
        responseType: 'text',
        transformResponse: [],
        ...cookieObject,
    });

    if (status === 200) {
        // TODO: cache data

        return data;
    }
    return undefined;
}

export async function testCookie(cookie: string | undefined): Promise<boolean> {
    if (cookie === undefined || cookie.length !== 128 || cookie.match(/\W+/)) {
        return false;
    }

    let loggedIn: boolean = false;

    await axios.get('/settings',
        {
            headers: { cookie: `session=${cookie};` },
            baseURL: base,
            maxRedirects: 0,
        }
    ).then(
        () => loggedIn = true,
        () => loggedIn = false,
    );

    return loggedIn;
}
