import * as vscode from 'vscode';

import { login } from './commands/login';
import { logout } from './commands/logout';
import { saveData } from './commands/saveData';

import { SelectDayView } from './views/selectDayView';
import { DescriptionView } from './views/descriptionView';

import { testCookie } from './utils/request';

type Selection = object & {
	year?: number,
	day?: number,
	loggedIn?: boolean
};

const selection: Selection = {
	year: undefined,
	day: undefined,
	loggedIn: false
};

export let selectionProxy: Selection;

export async function activate(context: vscode.ExtensionContext) {
	// TODO: check if internet available

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.loadCookie', async (): Promise<string | undefined> => {
			const cookie: string | undefined = await context.secrets.get('advent-of-vscode.loginCookie');

			const loggedIn: boolean = await testCookie(cookie);
			vscode.commands.executeCommand('setContext', 'advent-of-vscode.loggedIn', loggedIn);
			selectionProxy.loggedIn = loggedIn;

			return loggedIn ? cookie : undefined;
		})
	);

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
	const descriptionView: DescriptionView = new DescriptionView(context);

	selectionProxy = new Proxy(selection, {
		set(target: Selection, prop: keyof Selection, value: boolean | (number | undefined)) {
			if (target[prop] !== value) {
				target[prop] = value as never;
				descriptionView.selectDay(target.year, target.day);
			}
			return true;
		}
	});

	/// Checks if cookie is stored and working, if so, sets user status to logged in
	vscode.commands.executeCommand('advent-of-vscode.loadCookie');

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.select',
			(year: number, day: number) => {
				selectionProxy.year = year;
				selectionProxy.day = day;
				vscode.commands.executeCommand('setContext', 'advent-of-vscode.daySelected', true);
			})
	);

	/// Description
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.openDescriptionPanel',
			() => descriptionView.descriptionPanel()
		)
	);


	// Data
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.openDataEditor',
			() => { }
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.saveData',
			() => saveData(context, selectionProxy.year, selectionProxy.day) // TODO: change for inline cmds
		)
	);
}

export function deactivate() { }
