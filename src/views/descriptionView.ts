import * as vscode from 'vscode';

import { getDefaultHtml, getNonce } from '../utils/helper';
import { fetchDescription } from '../utils/request';

export class DescriptionView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _panels: vscode.WebviewPanel[] = [];

    private title: string = 'AoC Description';
    private description: string = '<div class="center">Please Select a Day</div>';

    constructor(private context: vscode.ExtensionContext) {
        this.context.subscriptions.push(
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

        this._view.webview.html = getDefaultHtml(this.description, webviewView.webview, this.context);
    }

    async descriptionPanel(): Promise<vscode.WebviewPanel> { // TODO: use workspaceStorage to reopen panels after reopening vscode
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

    async selectDay(year: number | undefined, day: number | undefined): Promise<void> {
        if (year === undefined || day === undefined) {
            return;
        }
        // TODO: get data from aoc / cache

        this.title = `AoC ${year} Day ${day}`;
        this.description = '<div class="spinner"></div>';

        this._view!.description = this.title;
        this._view?.webview.postMessage(this.description);

        this._panels.forEach(async panel => {
            panel.title = this.title;
            panel.webview.postMessage(this.description);
        });

        this.description = await fetchDescription(year, day);

        this._view?.webview.postMessage(this.description);
        this._panels.forEach(async panel => {
            panel.webview.postMessage(this.description);
        });
    }
}
