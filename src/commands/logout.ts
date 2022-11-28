import * as vscode from 'vscode';

import { selectionProxy } from '../extension';

export async function logout(context: vscode.ExtensionContext): Promise<void> {
	if (await context.secrets.get('advent-of-vscode.loginCookie') === undefined) {
		return;
	}

	context.secrets.delete('advent-of-vscode.loginCookie');

	// TODO: delete cache for data & later parts of description
	// update decription & data view

	/// registers change
	await context.secrets.get('advent-of-vscode.loginCookie');

	if (await context.secrets.get('advent-of-vscode.loginCookie') === undefined) {
		vscode.window.showInformationMessage('Successfully logged out of AoC');
		vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', false);
		selectionProxy.loggedIn = false;
	}
	else {
		vscode.window.showErrorMessage('Failed to log out of AoC. [Try again](command:advent-of-vscode.logout)');
	}
}
