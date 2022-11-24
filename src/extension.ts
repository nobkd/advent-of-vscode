import * as vscode from 'vscode';

import { login } from './commands/login';
import { logout } from './commands/logout';
import { copyData } from './commands/copyData';

import { DataView } from './views/dataView';
import { DescriptionView } from './views/descriptionView';
import { SelectDayView } from './views/selectDayView';
import { testCookie } from './utils/request';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.loadCookie', async (): Promise<string | undefined> => {
			const cookie = await context.secrets.get('advent-of-vscode.loginCookie');
			const loggedIn = await testCookie(cookie);

			vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', loggedIn);

			return loggedIn ? cookie : undefined;
		})
	);

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

	const descriptionView = new DescriptionView(context);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.select',
			(year: number, day: number) => descriptionView.selectDay(year, day))
	);

	new SelectDayView(context);

	new DataView(context);
}

export function deactivate() { }
