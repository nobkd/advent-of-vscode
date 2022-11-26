import * as vscode from 'vscode';

import { fetchData } from '../utils/request';

// https://code.visualstudio.com/api/extension-guides/virtual-documents

// TODO: add login request when not logged in with aoc account / request login cookie?
// TODO: add save as file & copy buttons

export class DataView {
	private _data?: string;

	private year?: number;
	private day?: number;

	constructor(private context: vscode.ExtensionContext) {
		// TODO: register
	}

	async displayData(): Promise<void> {
		this._data = undefined;

		[this.year, this.day] = this.context.globalState.get('advent-of-vscode.selected') as Array<number> | undefined;
		
		if (this.year !== undefined && this.day !== undefined) {
			this._data = await fetchData(this.year, this.day);
		}
	}


	getData(): string | undefined {
		if (this._data === undefined) {
			vscode.window.showErrorMessage('Failed to get AoC data. Please [log in](command:advent-of-vscode.login) first.');
		}

		return this._data;
	}

	getYear(): number | undefined {
		return this.year;
	}

	getDay(): number | undefined {
		return this.day;
	}
}
