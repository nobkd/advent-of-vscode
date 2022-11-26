import * as vscode from 'vscode';

export async function saveData(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined, data: string | undefined): Promise<void> {
    if (year === undefined || day === undefined || data === undefined) {
        return;
    }

    const savePath: vscode.Uri | undefined = await vscode.window.showSaveDialog(
        {
            defaultUri: vscode.Uri.file(`aoc-${year}-${day}.txt`),
            saveLabel: 'Save AoC Data',
            title: `AoC ${year} Day ${day}`,
            filters: { 'Text': ['txt', 'aoc'] }
        }
    );

    if (savePath !== undefined) {
        vscode.workspace.fs.writeFile(savePath, new TextEncoder().encode(data));
        vscode.window.showInformationMessage(`Saved AoC Data: ${savePath}`);
    }
}
