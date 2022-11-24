import axios from 'axios';
import * as jsdom from 'jsdom';

import { getUri } from './getUri';

export async function loadWebsiteData(year: number, day: number): Promise<string | undefined> {
    const { data, status } = await axios.get(getUri(year, day));
    if (status === 200) {
        const dom = new jsdom.JSDOM(data)
        return dom.window.document.body.getElementsByClassName('day-desc')[0].innerHTML;
    }
}