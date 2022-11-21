import { getProfileArguments } from '@vscode/test-electron/out/runTest';
import * as vscode from 'vscode';

type Tree = object & {
    key: number,
    year?: number,
    children?: Tree[]
};

// https://code.visualstudio.com/api/extension-guides/tree-view

// TODO: finish tree generation and display and push selected day to global context for desciptionView and dataView to access it

export class SelectDayView {
    constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('selectDayView', { treeDataProvider: provider(), showCollapseAll: true, canSelectMany: false });
        context.subscriptions.push(view);
    }
}

function generateTree(): Tree[] {
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
            return {
                label: element.key.toString(),
                collapsibleState: element && element.children?.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                contextValue: element.children === null ? "day" : "year",
                //command: set `selected` with element.year, element.day
            };
        }
    };
}
