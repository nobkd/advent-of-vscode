import * as vscode from 'vscode';

// https://code.visualstudio.com/api/extension-guides/webview

// TODO: implement requesting description to active day from https://adventofcode.com then format it fitting to vscode and display it

export class DescriptionView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private context: vscode.ExtensionContext) {}

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            enableForms: false
        };

        console.log(this.context.globalState.get('advent-of-vscode.selected'));

        webviewView.webview.html = `
        <!DOCTYPE html>
        <html lang="en" style="margin: 0; padding: 0; border: 0;">
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="height: 100vh; width: 100vw;">
                <iframe src="https://www.adventofcode.com/" width="100%" height="100%">
            </body>
        </html>
        `;

    }
}
