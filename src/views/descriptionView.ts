import * as vscode from 'vscode';

import { getNonce } from '../utils/helper';
import { getDescription } from '../utils/request';

// https://code.visualstudio.com/api/extension-guides/webview

const placeholder: string = 'Nothing to see here :(';

export class DescriptionView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _panels: vscode.WebviewPanel[] = [];

    private currentHtml?: string;

    constructor(private context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider('descriptionView',
                this,
                { webviewOptions: { retainContextWhenHidden: true } },
            )
        );
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        this._view = webviewView;

        this._view.webview.options = { enableScripts: true };

        const scriptUri = this._view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const nonce = getNonce();

        this._view.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';"/>
            </head>
            <body>
                <div id="view">${placeholder}</div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>
        `;
    }

    async descriptionPanel() {
        const panel = vscode.window.createWebviewPanel(`descriptionPanel-${getNonce()}`,
            'AoC Description',
            vscode.ViewColumn.Active,
            { enableScripts: true },
        );

        this._panels.push(panel);
        panel.onDidDispose(() => this._panels.splice(this._panels.indexOf(panel), 1));

        panel.webview.html = this._view!.webview.html;
        panel.webview.postMessage(this.currentHtml || placeholder);

        return panel;
    }

    async selectDay(year: number, day: number): Promise<void> {
        // TODO: get data from aoc / cache
        const info = `AoC ${year} Day ${day}`;
        const load = 'Please wait...';

        this._view!.description = info;
        this._view?.webview.postMessage(load);

        this._panels.forEach(async element => {
            element.title = info;
            element.webview.postMessage(load);
        });

        const data = await getDescription(year, day);

        this._view?.webview.postMessage(data);
        this._panels.forEach(async element => {
            element.webview.postMessage(data);
        });

        this.currentHtml = data;
    }
}
