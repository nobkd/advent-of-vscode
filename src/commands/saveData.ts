import * as vscode from 'vscode';

import { TextEncoder } from 'util';
import { selectionProxy } from '../extension';
import { fetchData } from '../utils/request';

export async function saveData(context: vscode.ExtensionContext): Promise<void> {
    if (selectionProxy.loggedIn === false) {
        vscode.window.showErrorMessage('Please [log in](command:advent-of-vscode.login) before getting data');
    }

    // TODO: get data from inline command
    const year = undefined;
    const day = undefined;
    const data = await fetchData(year, day);

    const filename = `aoc-${selectionProxy.year}-${selectionProxy.day}.txt`;
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
