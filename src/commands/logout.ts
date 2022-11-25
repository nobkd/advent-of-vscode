import * as vscode from 'vscode';

export async function logout(context: vscode.ExtensionContext, args: Array<any> | undefined = undefined): Promise<void> {
	context.secrets.delete('advent-of-vscode.loginCookie');

	if (await context.secrets.get('advent-of-vscode.loginCookie') === undefined) {
		vscode.window.showInformationMessage('Successfully logged out of AoC');
		vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', false);
	}
	else {
		vscode.window.showErrorMessage('Failed to log out of AoC.');
	}
}
