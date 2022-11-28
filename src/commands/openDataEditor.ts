import * as vscode from 'vscode';

import { collectFetchData } from '../utils/helper';

export async function openDataEditor(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined) {
    const content = await collectFetchData(year, day);
    if (content === undefined) {
        return;
    }
    const doc = await vscode.workspace.openTextDocument({
        content: content,
        language: 'txt'
    });

    const filename = `aoc-${year}-${day}.txt`;
    const workspace = vscode.workspace.workspaceFolders;

    // TODO: set filename somehow?

    const editor = vscode.window.showTextDocument(doc, {
        preview: true,
        preserveFocus: true,
        viewColumn: vscode.ViewColumn.Active
    });
}