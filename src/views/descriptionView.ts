import * as vscode from 'vscode';

import { getNonce } from '../utils/helper';
import { getDescription } from '../utils/request';

// https://code.visualstudio.com/api/extension-guides/webview

export class DescriptionView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _panels: vscode.WebviewPanel[] = [];

    private title: string = 'AoC Description';
    private description: string = 'Please Select a Day';

    constructor(private context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider('descriptionView',
                this,
                { webviewOptions: { retainContextWhenHidden: true } },
            )
        );
    }

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this._view = webviewView;

        this._view.webview.options = { enableScripts: true };
        this._view.description = this.title;

        const scriptUri: vscode.Uri = this._view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'res', 'main.js'));
        const nonce: string = getNonce();

        this._view.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';"/>
            </head>
            <body>
                <div id="view">${this.description}</div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>
        `;
    }

    async descriptionPanel(): Promise<vscode.WebviewPanel> {
        const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(`descriptionPanel-${getNonce()}`, // TODO: get UNIQUE nonce
            this.title,
            vscode.ViewColumn.Active,
            { enableScripts: true, retainContextWhenHidden: true },
        );

        panel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'res', 'icon.svg');

        this._panels.push(panel);
        panel.onDidDispose(() => this._panels.splice(this._panels.indexOf(panel), 1));

        panel.webview.html = this._view!.webview.html;
        panel.webview.postMessage(this.description);

        return panel;
    }

    async selectDay(year: number, day: number): Promise<void> {
        // TODO: get data from aoc / cache

        this.title = `AoC ${year} Day ${day}`;
        const loading = 'Please wait...'; // TODO: replace with animation (maybe AoVSC icon rotating)

        this._view!.description = this.title;
        this._view?.webview.postMessage(loading);

        this._panels.forEach(async panel => {
            panel.title = this.title;
            panel.webview.postMessage(loading);
        });

        this.description = await getDescription(year, day);

        this._view?.webview.postMessage(this.description);
        this._panels.forEach(async element => {
            element.webview.postMessage(this.description);
        });
    }
}
