import * as vscode from 'vscode';

export function login(context: vscode.ExtensionContext, args: Array<any> | undefined = undefined): void {


    // TODO: save cookie as secret
    // TODO: implement logic of checking if user really is logged in
    
    vscode.commands.executeCommand(
		'setContext',
		'advent-of-vscode.loggedIn',
		true
	);
}