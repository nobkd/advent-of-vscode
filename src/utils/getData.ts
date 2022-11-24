import axios from 'axios';
import * as jsdom from 'jsdom';

export async function getData(url: string): Promise<string | undefined> {
    const { data, status } = await axios.get(url);
    if (status === 200) {
        if (url.endsWith('/input')) {
            return data;
        }
        else {
            const dom = new jsdom.JSDOM(data);
            return dom.window.document.body.getElementsByClassName('day-desc')[0].innerHTML;
        }
    }
}
