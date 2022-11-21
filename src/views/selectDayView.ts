import * as vscode from 'vscode';

type Tree = object & {
    key: number,
    child: Tree | null
};

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
    // TODO convert to parsable syntax fpr TreeView and TreeDataProvider ...

    const fullMonthsObjects: Tree[] = fullMonths.map((value: number, index: number, array: number) => {
        return { key: value, child: null };
    });
    const currentMonthObjects: Tree[] = isDecember ? fullMonthsObject.slice(0, day - 1) : [];

    const yearsObject: Tree[] = years.map((value: number, index: number, array: number[]) => {
        return { key: value, child: value !== year ? fullMonthsObjects : currentMonthObjects };
    });

    return yearsObject;
}

function provider(): vscode.TreeDataProvider<{ key: number }> {
    const tree: object = generateTree();
    console.log(tree);

    return {
        getChildren: (element: { key: number } | undefined): { key: number }[] | undefined => {
            return;
        },
        getTreeItem: (element: { key: number }): vscode.TreeItem => {
            const treeElement = {};
            return {
                label: element.key,
                collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
            };
        },
    };
}
