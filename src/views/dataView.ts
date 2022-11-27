import * as vscode from 'vscode';

import { fetchData } from '../utils/request';

// https://code.visualstudio.com/api/extension-guides/webview

// TODO: destructure to commands as a view no longer exists

export class DataView {
	private data?: string = undefined;
	private year?: number;
	private day?: number;

	constructor() {}

	async selectDay(year: number, day: number): Promise<void> {
		this.data = undefined;
		this.year = year;
		this.day = day;
		
		// TODO: get data from aoc / cache
		this.data = await fetchData(year, day);
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

		return [this.year, this.day, this.data];
	}

	dataEditor(): void {
		// TODO: open data editor
	}
}
