import * as vscode from 'vscode';

import axios from 'axios';
import { JSDOM } from 'jsdom';


const base: string = 'https://adventofcode.com';

export async function getDescription(year: number, day: number): Promise<string> {
    const { data, status, statusText } = await axios.get(`/${year}/day/${day}`, {
        baseURL: base,
        responseType: 'document',
    });

    if (status === 200) {
        const dom = new JSDOM(data);
        return dom.window.document.body.getElementsByClassName('day-desc')[0].innerHTML;
    }
    return statusText;
}


export async function getData(year: number, day: number): Promise<string> {
    const cookie: string = await vscode.commands.executeCommand('advent-of-vscode.loadCookie');
    const { data, status, statusText } = await axios.get(`/${year}/day/${day}/input`, {
        headers: { cookie: `session=${cookie};` },
        baseURL: base,
        responseType: 'text',
        transformResponse: [],
    });

    if (status === 200) {
        return data;
    }
    return statusText;
}

export async function testCookie(cookie: string | undefined): Promise<boolean> {
    if (cookie === undefined) {
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
        () => { }
    );

    return loggedIn;
}
