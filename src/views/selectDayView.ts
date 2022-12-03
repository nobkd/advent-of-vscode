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
                this.provider.refresh();
                this.date = new Date();
            },
            new Date(Date.UTC(
                this.date.getUTCFullYear(),
                this.date.getUTCMonth(),
                this.date.getUTCDate() + (this.date.getUTCHours() < 5 ? 0 : 1), // if not yet 5 o'clock use current day, else use next day
                5, // `UTC-5 00:00` => `UTC 05:00`
                0,
                0,
                10 // placeholder / safety time
            )).getTime() - this.date.getTime(),
        );
    }

    refresh(): void {
        this.provider.refresh();
    }
}

function generateTree(): Tree[] {
    const date: Date = new Date();
    date.setUTCDate(date.getUTCDate() - (date.getUTCHours() < 5 ? 1 : 0)); // if not yet 5 o'clock use last day, else use current day
    const year: number = date.getUTCFullYear();
    const month: number = date.getUTCMonth();
    const day: number = date.getUTCDate();

    const startYear: number = 2015;
    const isDecember: boolean = month === 11; // Month is zero-based
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
        refresh: () => { tree = generateTree(); onDidChangeTreeData.fire(); }
    };
}
