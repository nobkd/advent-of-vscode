import * as vscode from 'vscode';

import { testCookie } from '../utils/request';

export async function login(context: vscode.ExtensionContext, args: Array<any> | undefined = undefined): Promise<void> {
	const secretsSupported = await context.globalState.get('advent-of-vscode.secretsSupported');

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
			}
			else {

			}

			vscode.window.showInformationMessage('Successfully logged in to AoC');
			vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', true);
		}
		else {
			vscode.window.showErrorMessage('Your cookie is not correct. [Try again](command:advent-of-vscode.login)');
		}
	}
}
