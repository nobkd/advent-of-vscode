import * as vscode from 'vscode';

export function logout(context: vscode.ExtensionContext, args: Array<any> | undefined = undefined): void {

	// TODO: delete cookie from secrets
	// TODO: implement logic to check if cookie really is deleted

	context.secrets.delete('advent-of-vscode.loginCookie');

	vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', false);
}
