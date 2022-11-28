import * as vscode from 'vscode';

import { selectionProxy } from '../extension';
import { testCookie } from '../utils/request';

export async function login(context: vscode.ExtensionContext): Promise<void> {
	if (context.globalState.get('advent-of-vscode.loggedIn', false)) {
		vscode.window.showErrorMessage('You are currently logged in. Please [log out](command:advent-of-vscode.logout) to use another account.');
		return;
	}

	const cookie: string | undefined = await vscode.window.showInputBox({
		title: 'Login to AoC',
		placeHolder: 'Paste your AoC "session" cookie from your browser here',
		password: true,
		ignoreFocusOut: true,
		validateInput: async (value: string) => await testCookie(value) ? undefined : 'Your cookie is not correct',
	});

	if (cookie !== undefined) {
		if (await testCookie(cookie)) {
			context.secrets.store('advent-of-vscode.loginCookie', cookie);

			/// registers change
			await context.secrets.get('advent-of-vscode.loginCookie');

			if (await context.secrets.get('advent-of-vscode.loginCookie') !== undefined) {
				vscode.window.showInformationMessage('Successfully logged in to AoC');
				vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', true);
				selectionProxy.loggedIn = true;
			}
			else {
				vscode.window.showErrorMessage('Failed to store you cookie. You might have another error message explaining this. In case you could fix this error (e.g. by starting your secrets wallet service or installing a keyring) please try restarting the app and try logging in again');
			}
		}
		else {
			vscode.window.showErrorMessage('Your cookie is not correct. [Try again](command:advent-of-vscode.login)');
		}
	}
}
