import * as vscode from 'vscode';
import { TextEncoder } from 'util';

import { collectFetchInput } from '../utils/helper';

export async function saveInput(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined): Promise<void> {
    const data = await collectFetchInput(year, day);
    if (data === undefined) {
        return;
    }

    const filename = `aoc-${year}-${day}.txt`; // TODO: better filename / customize filenaming structure in options?
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
