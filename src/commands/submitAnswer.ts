import * as vscode from 'vscode';

import { postAnswer } from '../utils/request';

export async function submitAnswer(year: number | undefined, day: number | undefined) {
    const level = await vscode.window.showQuickPick(['Level 1', 'Level 2'], {
        canPickMany: false,
        ignoreFocusOut: true,
    });

    if (year !== undefined && day !== undefined && level !== undefined) {
        const answer = await vscode.window.showInputBox({
            ignoreFocusOut: true,
            title: `AoC ${year} Day ${day} Level ${level}`,
            placeHolder: 'Insert Your Answer',
            validateInput: (value: any) => value === undefined && value === '' ? 'Please Insert your Answer' : undefined,
        });
        if (answer !== undefined) {

            const result = await postAnswer(year, day, level === 'Level 1' ? 1 : 2, answer);
            if (result !== undefined) {
                vscode.window.showInformationMessage(result);
            }
        }
    }
}