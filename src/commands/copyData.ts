import * as vscode from 'vscode';

export async function copyData(context: vscode.ExtensionContext, args: Array<number> | undefined): Promise<void> {
    if (args === undefined || args === null || args?.length < 2) {
        vscode.window.showErrorMessage('Command: "advent-of-vscode.copyData" failed due to missing arguments');
        return;
    }
    const [year, day]: number[] = args;

    // TODO: get data from data view / cache / website / maybe without args?
    // TODO: throw error if user not logged in
    // TODO: push data to clipboard

    //navigator.clipboard.writeText('data'); // not working, navigaot not available in Node?
    vscode.commands.executeCommand(
        'editor.action.clipboardCopyAction', // only copies selected editor content.....
        'data' // set to data from data view
    );

    vscode.window.showInformationMessage('Copied AoC Data to Clipboard');
}
