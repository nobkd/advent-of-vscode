import * as vscode from 'vscode';

import { login } from './commands/login';
import { logout } from './commands/logout';
import { saveInput } from './commands/saveInput';
import { openInputEditor } from './commands/openInputEditor';
import { submitAnswer } from './commands/submitAnswer';

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
			selectionProxy.year = context.globalState.get('advent-of-vscode.selected', { year: undefined }).year;
			selectionProxy.day = context.globalState.get('advent-of-vscode.selected', { day: undefined }).day;

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

	const selectDayView: SelectDayView = new SelectDayView(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.refreshTree',
			() => selectDayView.refresh()
		)
	);

	const descriptionView: DescriptionView = new DescriptionView(context);

	selectionProxy = new Proxy(selection, {
		set(target: Selection, prop: keyof Selection, value: boolean | (number | undefined)) {
			if (target[prop] !== value) {
				target[prop] = value as never;
				descriptionView.selectDay(target.year, target.day);
				vscode.commands.executeCommand('setContext', 'advent-of-vscode.daySelected', target.year !== undefined && target.day !== undefined);
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
				context.globalState.update('advent-of-vscode.selected', { year: year, day: day });
			})
	);

	/// Description
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.openDescriptionPanel',
			() => descriptionView.descriptionPanel()
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.refreshDescription',
			() => descriptionView.selectDay(selectionProxy.year, selectionProxy.day)
		)
	);

	// Input
	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.openInputEditor',
			async (year: number | undefined, day: number | undefined) => openInputEditor(context, year ?? selectionProxy.year, day ?? selectionProxy.day)
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.saveInput',
			(year: number | undefined, day: number | undefined) => saveInput(context, year ?? selectionProxy.year, day ?? selectionProxy.day) // TODO: change for inline cmds
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('advent-of-vscode.submitAnswer',
			(year: number | undefined, day: number | undefined) => submitAnswer(year ?? selectionProxy.year, day ?? selectionProxy.day)
		)
	);
}

export function deactivate() { }
