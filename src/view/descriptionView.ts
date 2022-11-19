import * as vscode from 'vscode';

// https://code.visualstudio.com/api/extension-guides/webview

// TODO: implement requesting description to active day from https://adventofcode.com then format it fitting to vscode and display it

export class DescriptionView implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) {

    };

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {

    }
}
