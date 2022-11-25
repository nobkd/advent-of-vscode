import * as vscode from 'vscode';

export async function saveData(context: vscode.ExtensionContext, data: string): Promise<void> {
    // TODO: get data from data view
    // TODO: throw error if user not logged in
    // TODO: open file save dialog

    //navigator.clipboard.writeText('data'); // not working, navigaot not available in Node?
    vscode.commands.executeCommand(
        'editor.action.clipboardCopyAction', // only copies selected editor content.....
        'data' // set to data from data view
    );

    // TODO: add path
    vscode.window.showInformationMessage('Saved AoC Data: "path"');
}
