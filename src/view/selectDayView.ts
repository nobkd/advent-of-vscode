import * as vscode from 'vscode';

export class SelectDayView {
    constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('selectDayView', { treeDataProvider: provider(), showCollapseAll: true, canSelectMany: false });
        context.subscriptions.push(view);
    }


}

function provider(): vscode.TreeDataProvider<{ key: string }> {
    return {};
}
