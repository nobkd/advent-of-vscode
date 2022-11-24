import * as vscode from 'vscode';

type Tree = object & {
    key: number,
    year?: number,
    children?: Tree[]
};

// https://code.visualstudio.com/api/extension-guides/tree-view

export class SelectDayView {
    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.window.createTreeView('selectDayView', {
                treeDataProvider: provider(),
                showCollapseAll: true,
                canSelectMany: false,
            })
        );
    }
}

function generateTree(): Tree[] {
    const date: Date = new Date();
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const day: number = date.getDate();

    const startYear: number = 2015;
    const isDecember: boolean = month === 12;
    const puzzleDays: number = 25;

    const yearCount: number = year - startYear;
    let counter: number = startYear;
    const years: number[] = [...new Array(isDecember ? yearCount + 1 : yearCount)].map(() => counter++);
    counter = 1;
    const fullMonths: number[] = [...new Array(puzzleDays)].map(() => counter++);

    const fullMonthsObjects: Tree[] = fullMonths.map((itemValue: number) => {
        return { key: itemValue };
    });
    const currentMonthObjects: Tree[] = isDecember ? fullMonthsObjects.slice(0, day) : [];

    const yearsObjects: Tree[] = years.map((itemValue: number) => {
        let children: Tree[] = itemValue !== year ? fullMonthsObjects : currentMonthObjects;
        children = children.map((treeItem: Tree) => treeItem = { ...treeItem, year: itemValue });

        return {
            key: itemValue,
            children: children
        };
    });

    return yearsObjects;
}

function provider(): vscode.TreeDataProvider<Tree> {
    const tree: Tree[] = generateTree();

    return {
        getChildren: (element: Tree | undefined): Tree[] | undefined => {
            return element === undefined ? tree : element.children;
        },
        getTreeItem: (element: Tree): vscode.TreeItem => {
            const isDay: boolean = element.children === undefined;

            return {
                label: element.key.toString(),
                collapsibleState: element && element.children?.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                contextValue: isDay ? "day" : "year",
                command: isDay ? {
                    title: 'Select AoC Day',
                    command: 'advent-of-vscode.select',
                    arguments: [element.year, element.key]
                } : undefined
            };
        }
    };
}
