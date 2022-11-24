import * as vscode from 'vscode';

import { getData } from '../utils/getData';
import { getUrl } from '../utils/getUrl';

// https://code.visualstudio.com/api/extension-guides/webview

// TODO: implement requesting description to active day from https://adventofcode.com then format it fitting to vscode and display it


const placeholder: string = 'Nothing to see here :(';

export class DescriptionView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        this._view = webviewView;

        webviewView.webview.options = { enableScripts: true };

        const scriptUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const nonce = getNonce();

        webviewView.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${webviewView.webview.cspSource};"/>
                <!-- TODO: add styles -->
            </head>
            <body>
                <div id="view">${placeholder}</div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>
        `;

    }

    async selectDay(year: number, day: number): Promise<void> {
        // TODO: get data from aoc / cache
        this._view!.description = `AoC ${year} Day ${day}`;
        this._view!.webview.postMessage('Please wait...');

        const data = await getData(getUrl(year, day, false));
        this._view!.webview.postMessage(data !== undefined ? data as string : placeholder);
    }
}

function getNonce(): string {
    let text: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
