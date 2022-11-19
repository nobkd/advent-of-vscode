import * as vscode from 'vscode';

// https://code.visualstudio.com/api/extension-guides/tree-view

// TODO: finish tree generation and display and push selected day to global context for desciptionView and dataView to access it

export class SelectDayView {
    constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('selectDayView', { treeDataProvider: provider(), showCollapseAll: true, canSelectMany: false });
        context.subscriptions.push(view);
    }
}

function generateTree(): object {
    const date: Date = new Date();
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const day: number = date.getDate();

    const startYear: number = 2015;
    const isDecember: boolean = month === 12;
    const decemberDays: number = 31;

    const yearCount: number = year - startYear;
    let counter: number = startYear;
    const years: number[] = [...new Array(isDecember ? yearCount + 1 : yearCount)].map(() => counter++);
    counter = 1;
    const fullMonths: number[] = [...new Array(decemberDays)].map(() => counter++);
    counter = 1;
    const currentMonth: number[] = [...new Array(isDecember ? day : 0)].map(() => counter++);

    // TODO convert to parsable syntax fpr TreeView and TreeDataProvider ...

    return {};
}

function provider(): vscode.TreeDataProvider<{ key: string }> {
    const tree: object = generateTree();
    console.log(tree);

    return {
        getChildren: (element: { key: string } | undefined): { key: string }[] | undefined => {
            return;
        },
        getTreeItem: (element: { key: string }): vscode.TreeItem => {
            const treeElement = {};
            return {
                label: element.key,
                collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
            };
        },
    };
}
