import * as vscode from 'vscode';

// https://code.visualstudio.com/api/extension-guides/webview

// TODO: implement requesting description to active day from https://adventofcode.com then format it fitting to vscode and display it

export class DescriptionView implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true
        };

        console.log(this.context.globalState.get('advent-of-vscode.selected'));

        const scriptUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const nonce = getNonce();

        webviewView.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!-- TODO: add styles -->
            </head>
            <body>
                <div id="view">Nothing to see here :(</div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>
        `;

    }

    selectDay(year: number, day: number): void {
        // TODO: get data from aoc / cache
        const data = `<a href="https://adventofcode.com/${year}/day/${day}>AoC ${year} ${day}</a>`;
        this._view?.webview.postMessage(data);
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
