import * as vscode from 'vscode';

export function logout(context: vscode.ExtensionContext, args: Array<any> | undefined = undefined): void {

	// TODO: delete cookie from secrets
	// TODO: implement logic to check if cookie really is deleted.

	vscode.commands.executeCommand(
		'setContext',
		'advent-of-vscode.loggedIn',
		false
	);
}