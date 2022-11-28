import * as vscode from 'vscode';

import { collectFetchData } from '../utils/helper';

export async function openDataEditor(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined) {
    const content = await collectFetchData(year, day);
    if (content === undefined) {
        return;
    }
    const filename = `aoc-${year}-${day}.txt\n`;
    // TODO: set filename somehow?
    vscode.window.showTextDocument(await vscode.workspace.openTextDocument({ content: content }),
        { preview: true, viewColumn: vscode.ViewColumn.Active }
    );
}