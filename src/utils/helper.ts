import * as vscode from 'vscode';

import { fetchInput } from './request';
import { selectionProxy } from '../extension';

export function getNonce(): string {
    let text: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export type CookieObject = object & { headers?: { cookie: string } };

export async function getCookieObject(): Promise<CookieObject> {
    const cookie: string | undefined = await vscode.commands.executeCommand('advent-of-vscode.loadCookie');
    if (cookie !== undefined) {
        return { headers: { cookie: `session=${cookie};` } };
    }
    return {};
}

export function getDefaultHtml(defaultData: any, webview: vscode.Webview, context: vscode.ExtensionContext) {
    const scriptNonce = getNonce();
    const styleNonce = getNonce();

    // TODO: insert loading spinner css
    return `
        <!DOCTYPE html>
        <html lang="en" style="scrollbar-gutter: stable;">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${styleNonce}'; script-src 'nonce-${scriptNonce}';"/>
            </head>
            <body>
                <div id="view">${defaultData}</div>
                <script nonce="${scriptNonce}">
                    window.addEventListener('message', event => document.getElementById('view').innerHTML = event.data);
                </script>
                <style nonce="${styleNonce}">
                    .spinner:before {
                        width: 25px;
                        height: 25px;
                        background-color: orange;
                        background-image: url("${vscode.Uri.joinPath(context.extensionUri, 'res', 'icon.svg')}");
                        background-size: 25px 25px;
                    }
                </style>
            </body>
        </html>
    `;
}

export function collectFetchInput(year: number | undefined, day: number | undefined): Promise<string | undefined> {
    if (selectionProxy.loggedIn === false) {
        vscode.window.showErrorMessage('Please [log in](command:advent-of-vscode.login) before getting data');
    }

    return fetchInput(year, day);
}
