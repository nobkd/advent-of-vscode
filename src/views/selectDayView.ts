import * as vscode from 'vscode';

type Tree = object & {
    key: number,
    year?: number,
    children?: Tree[]
};

type RefreshTreeDataProvider<T> = vscode.TreeDataProvider<T> & {
    refresh(): void
};

export class SelectDayView {
    private date: Date = new Date();
    private provider: RefreshTreeDataProvider<Tree> = provider();

    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.window.createTreeView('selectDayView', {
                treeDataProvider: this.provider,
                showCollapseAll: true,
                canSelectMany: false,
            })
        );

        setInterval(
            () => {
                const datecheck = new Date();
                if (this.date.getDate() !== datecheck.getDate()) {
                    this.provider.refresh();
                    this.date = datecheck;
                }
            }, 60000);
    }
}

function generateTree(): Tree[] {
    const date: Date = new Date();
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const day: number = date.getDate();

    const startYear: number = 2015;
    const isDecember: boolean = month === 11; /// Month zero-indexed???
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

function provider(): RefreshTreeDataProvider<Tree> {
    let tree: Tree[] = generateTree();

    const onDidChangeTreeData: vscode.EventEmitter<undefined | void> = new vscode.EventEmitter<undefined | void>();

    return {
        getChildren: (element: Tree | undefined): Tree[] | undefined => {
            return element === undefined ? tree : element.children;
        },
        getTreeItem: (element: Tree): vscode.TreeItem => {
            const isDay: boolean = element.children === undefined;

            return {
                label: element.key.toString(),
                collapsibleState: element && element.children?.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                contextValue: isDay ? 'day' : 'year',
                command: isDay ? {
                    title: 'Select AoC Day',
                    command: 'advent-of-vscode.select',
                    arguments: [element.year, element.key]
                } : undefined,
                tooltip: isDay ? `AoC ${element.year} Day ${element.key}` : `AoC ${element.key}`
            };
        },
        onDidChangeTreeData: onDidChangeTreeData.event,
        refresh: () => {tree = generateTree(); onDidChangeTreeData.fire();}
    };
}
