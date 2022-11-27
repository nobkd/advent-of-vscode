import axios from 'axios';
import { parse } from 'node-html-parser';

import { getCookieObject, CookieObject } from './helper';

const base: string = 'https://adventofcode.com';

export async function fetchDescription(year: number, day: number): Promise<string> {
    // TODO: load cached data

    const { data, status, statusText } = await axios.get(`/${year}/day/${day}`, {
        baseURL: base,
        responseType: 'document',
        ...(await getCookieObject()),
    });

    if (status === 200) {
        const dom = parse(data);
        const dayDescriptions = dom.querySelectorAll('.day-desc');

        // TODO: cache data

        /// loading all parts if logged in & part 1 completed
        let html = '';
        for (let i = 0; i < dayDescriptions.length; i++) {
            const dayDescription = dayDescriptions[i];
            const title = dayDescription.getElementsByTagName('h2')[0];
            html += `<details open><summary><b>${title.innerHTML.replace(/\s?---\s?(Day \d+:)?/g, '')}</b></summary>${dayDescription.removeChild(title).innerHTML}</details>`;
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
