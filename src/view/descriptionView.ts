import * as vscode from 'vscode';

export class DescriptionView implements vscode.WebviewViewProvider {

    constructor (private context: vscode.ExtensionContext) {};

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        throw new Error('Method not implemented.');
    }

}
