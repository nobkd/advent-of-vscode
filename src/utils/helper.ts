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
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${styleNonce}'; img-src https: ${webview.cspSource}; script-src 'nonce-${scriptNonce}';"/>
            </head>
            <body>
                <div id="view">${defaultData}</div>
                <script nonce="${scriptNonce}">
                    window.addEventListener('message', event => document.getElementById('view').innerHTML = event.data);
                </script>
                <style nonce="${styleNonce}">
                    html {
                        scrollbar-gutter: stable;
                        width: calc(100vw - calc(100vw - 100%));
                        height: 100vh;
                    }
                    .center {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .spinner {
                        --size: 30px;

                        position: absolute;
                        top: calc(50% - var(--size) / 2);
                        left: calc(50% - var(--size) / 2);
                        transform: translate(-50%, -50%);

                        height: var(--size);
                        width: var(--size);
                        
                        background-image: url("${webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'res', 'icon.png'))}");
                        background-size: contain;
                        background-repeat: no-repeat;

                        animation: rotate 1.75s infinite;  /* TODO: Maybe rotate all the time with 'alternate' (or so)? */
                    }
                    @keyframes rotate {
                        0% {
                          transform: rotate(0deg)
                        }
                        100% {
                          transform: rotate(360deg)
                        }
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
