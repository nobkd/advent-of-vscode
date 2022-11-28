import * as vscode from 'vscode';
import { TextEncoder } from 'util';

import { collectFetchData } from '../utils/helper';

export async function saveData(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined): Promise<void> {
    const data = await collectFetchData(year, day);
    if (data === undefined) {
        return;
    }

    const filename = `aoc-${year}-${day}.txt`;
    const workspace = vscode.workspace.workspaceFolders;

    const savePath: vscode.Uri | undefined = await vscode.window.showSaveDialog(
        {
            defaultUri: vscode.Uri.file(`${workspace !== undefined ? workspace[0].uri.path : process.env.HOME}/${filename}`),
            saveLabel: 'Save AoC Data',
            title: `AoC ${year} Day ${day}`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            filters: { 'Text': ['txt', 'aoc'] }
        }
    );

    if (savePath !== undefined) {
        // TODO: check if file really is written
        vscode.workspace.fs.writeFile(savePath, new TextEncoder().encode(data));
        vscode.window.showInformationMessage(`Saved [AoC Data](${savePath})`);
    }
}
