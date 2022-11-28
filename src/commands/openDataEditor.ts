import * as vscode from 'vscode';

import { collectFetchData } from '../utils/helper';

export async function openDataEditor(context: vscode.ExtensionContext, year: number | undefined, day: number | undefined) {
    const data = await collectFetchData(year, day);
    if (data === undefined) {
        return;
    }

    const filename = `aoc-${year}-${day}.txt`;

}