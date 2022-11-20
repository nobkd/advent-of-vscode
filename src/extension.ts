import * as vscode from 'vscode';
import { DataView } from './view/dataView';
import { DescriptionView } from './view/descriptionView';
import { SelectDayView } from './view/selectDayView';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "advent-of-vscode" is now active!');

	vscode.commands.executeCommand(
		'setContext',
		'advent-of-vscode.loggedIn',
		true // TODO connect with saved / not saved aoc cookie / ...
	  );

	new SelectDayView(context);
	new DescriptionView(context);
	new DataView(context);
}

export function deactivate() { }
