import * as vscode from 'vscode';

import { getDefaultHtml } from '../utils/helper';
import { fetchData } from '../utils/request';

// https://code.visualstudio.com/api/extension-guides/webview

export class DataView implements vscode.WebviewViewProvider {
	private _view?: vscode.WebviewView;

	private data?: string = undefined;
	private title: string = 'AoC Data';
	private year?: number;
	private day?: number;

	constructor(private context: vscode.ExtensionContext) {
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider('dataView',
				this,
				{ webviewOptions: { retainContextWhenHidden: true } },
			)
		);
	}

	resolveWebviewView(webviewView: vscode.WebviewView): void { // HELP !?!??!?! does not get loaded, whatever...
		this._view = webviewView;

		this._view.webview.options = { enableScripts: true };
		this._view.description = this.title;

		this._view.webview.html = getDefaultHtml('Please Select a Day');
	}

	async selectDay(year: number, day: number): Promise<void> {
		// TODO: get data from aoc / cache

		this.data = undefined;
		this.title = `AoC ${year} Day ${day}`;
		this.year = year;
		this.day = day;

		this._view!.description = this.title;
		this._view?.webview.postMessage('Please wait...'); // TODO: replace with loading animation (maybe AoVSC icon rotating)

		this.data = await fetchData(year, day);
		this._view?.webview.postMessage(this.data !== undefined
			? `<code>${this.data.replace(/\r?\n/g, '<br/>')}</code>`
			: undefined
		);
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
}
