import * as vscode from 'vscode';

export async function saveData(context: vscode.ExtensionContext, year: number, day: number, data: string): Promise<void> {
    // TODO: get data from data view
    // TODO: throw error if user not logged in
    // TODO: open file save dialog

    const savePath: vscode.Uri | undefined = await vscode.window.showSaveDialog(
        {
            defaultUri: vscode.Uri.file(`aoc-${year}-${day}.txt`),
            saveLabel: 'Save AoC Data',
            title: `AoC ${year} Day ${day}`,
            filters: { 'Text': ['txt', 'aoc'] }
        }
    );

    if (savePath !== undefined) {
        // TODO: save file

        vscode.window.showInformationMessage(`Saved AoC Data: ${savePath}`);
    }
}
