import * as vscode from 'vscode';

import { testCookie } from '../utils/request';

export async function login(context: vscode.ExtensionContext, args: Array<any> | undefined = undefined): Promise<void> {
	if (context.globalState.get('advent-of-vscode.loggedIn', false)) {
		vscode.window.showErrorMessage('Already logged in. Please [log out](command:advent-of-vscode.logout) to use another account.');
		return;
	}

	const secretsSupported: boolean = context.globalState.get('advent-of-vscode.secretsSupported', true);

	const cookie: string | undefined = await vscode.window.showInputBox({
		title: 'Login to AoC',
		placeHolder: 'Paste your AoC "session" cookie from your browser here',
		password: true,
		ignoreFocusOut: true,
		validateInput: async (value: string) => await testCookie(value) ? undefined : 'Your cookie is not correct',
	});

	if (cookie !== undefined) {
		if (await testCookie(cookie)) {
			if (secretsSupported) {
				context.secrets.store('advent-of-vscode.loginCookie', cookie);

				if (await context.secrets.get('advent-of-vscode.loginCookie') !== undefined) {
					vscode.window.showInformationMessage('Successfully logged in to AoC');
					vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', true);
				}
			}
			else {
				// TODO: implement variant to save cookie unsafe --> warning asking for permission to do so
			}
		}
		else {
			vscode.window.showErrorMessage('Your cookie is not correct. [Try again](command:advent-of-vscode.login)');
		}
	}
}
