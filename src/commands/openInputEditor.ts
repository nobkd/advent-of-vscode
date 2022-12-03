import * as vscode from 'vscode';

import { collectFetchInput } from '../utils/helper';

export async function openInputEditor(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined) {
    const content = await collectFetchInput(year, day);
    if (content === undefined) {
        return;
    }
    const filename = `aoc-${year}-${day}.txt\n`;
    // TODO: set filename somehow?
    vscode.window.showTextDocument(await vscode.workspace.openTextDocument({ content: content }),
        { preview: true, viewColumn: vscode.ViewColumn.Active }
    );
}