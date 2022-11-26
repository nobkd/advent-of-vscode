import * as vscode from 'vscode';

import { fetchData } from '../utils/request';

// https://code.visualstudio.com/api/extension-guides/virtual-documents

export class DataView {
	private _data?: string;

	private year?: number;
	private day?: number;

	constructor(private context: vscode.ExtensionContext) {
		// TODO: register
		// TODO: set view
	}

	async selectDay(year: number, day: number): Promise<void> {
		this._data = await fetchData(year, day);
		this.year = year;
		this.day = day;

		// TODO: update view
	}

	async getData(): Promise<[number | undefined, number | undefined, string | undefined]> {
		// TODO: use global state instead
		const loggedIn: string | undefined = await vscode.commands.executeCommand('advent-of-vscode.loadCookie');
		if (loggedIn === undefined) {
			vscode.window.showErrorMessage('Please [log in](command:advent-of-vscode.login) before getting data');
		}
		else if (this.year === undefined || this.day === undefined) {
			vscode.window.showWarningMessage('Please select an AoC day first');
		}

		return [this.year, this.day, this._data];
	}
}
