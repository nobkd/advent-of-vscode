import * as vscode from 'vscode';

import { login } from './commands/login';
import { logout } from './commands/logout';
import { copyData } from './commands/copyData';

import { DataView } from './views/dataView';
import { DescriptionView } from './views/descriptionView';
import { SelectDayView } from './views/selectDayView';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "advent-of-vscode" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.login', (args) =>
			login(context, args)
		)
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.logout', (args) =>
			logout(context, args)
		)
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.copyData', (args) =>
			copyData(context, args)
		)
	);


	const descriptionViewProvider = new DescriptionView(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('descriptionView',
			descriptionViewProvider,
			{ webviewOptions: { retainContextWhenHidden: true } }
		)
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.select',
			(year: number, day: number) => descriptionViewProvider.selectDay(year, day))
	);

	new SelectDayView(context);
	new DataView(context);
}

export function deactivate() { }
