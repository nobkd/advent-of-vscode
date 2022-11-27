import * as vscode from 'vscode';

export function getNonce(): string {
    let text: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export type CookieObject = object & {headers?: {cookie: string}};

export async function getCookieObject(): Promise<CookieObject> {
    const cookie: string | undefined = await vscode.commands.executeCommand('advent-of-vscode.loadCookie');
    if (cookie !== undefined) {
        return { headers: { cookie: `session=${cookie};` } };
    }
    return {};
}

export function getDefaultHtml(defaultData: any) {
    const nonce = getNonce();

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';"/>
            </head>
            <body>
                <div id="view">${defaultData}</div>
                <script nonce="${nonce}">
                    window.addEventListener('message', event => document.getElementById('view').innerHTML = event.data);
                </script>
            </body>
        </html>
    `;
}
