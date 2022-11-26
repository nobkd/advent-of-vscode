import * as vscode from 'vscode';

export async function copyData(context: vscode.ExtensionContext, data: string | undefined): Promise<void> {
    if (data === undefined) {
        return;
    }

    // TODO: push data to clipboard

    //navigator.clipboard.writeText('data'); // not working, navigaot not available in Node?
    vscode.commands.executeCommand(
        'editor.action.clipboardCopyAction', // only copies selected editor content.....
        'data' // set to data from data view
    );

    vscode.window.showInformationMessage('Copied AoC Data to Clipboard');

}
