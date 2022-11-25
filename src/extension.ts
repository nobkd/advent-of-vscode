import * as vscode from 'vscode';

import { login } from './commands/login';
import { logout } from './commands/logout';
import { copyData } from './commands/copyData';
import { saveData } from './commands/saveData';

import { SelectDayView } from './views/selectDayView';
import { DescriptionView } from './views/descriptionView';
import { DataView } from './views/dataView';

import { testCookie } from './utils/request';

export async function activate(context: vscode.ExtensionContext) {
	// TODO: check if internet available

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.loadCookie', async (): Promise<string | undefined> => {
			const cookie = await context.secrets.get('advent-of-vscode.loginCookie');
			const loggedIn = await testCookie(cookie);

			vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', loggedIn);

			return loggedIn ? cookie : undefined;
		})
	);

	/// Checks if cookie is stored and working, if so, sets user status to logged in
	vscode.commands.executeCommand('advent-of-vscode.loadCookie');

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.login',
			() => login(context)
		)
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.logout',
			() => logout(context)
		)
	);

	new SelectDayView(context);

	const descriptionView = new DescriptionView(context);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.select',
			(year: number, day: number) => descriptionView.selectDay(year, day))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.openDescriptionPanel',
			() => descriptionView.descriptionPanel()
		)
	);

	const dataView = new DataView(context);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.copyData',
			() => copyData(context, dataView.getData())
		)
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.saveData',
			() => saveData(context, dataView.getData())
		)
	);
}

export function deactivate() { }
