import * as vscode from 'vscode';

export class SelectDayView {
    constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('selectDayView', { treeDataProvider: provider(), showCollapseAll: true, canSelectMany: false });
        context.subscriptions.push(view);
    }
}

function generateTree(endYear: number, endMonth: number, endDay: number): Map<number, number[]> {
    const currentMonthIsDecember = endMonth === 12;

    const years: number[] = [];
    for (let yearCounter = 2015; yearCounter <= (currentMonthIsDecember ? endYear : endYear - 1); yearCounter++) {
        years.push(yearCounter);
    }

    const days: number[] = [];
    for (let dayCounter = 1; dayCounter <= 31; dayCounter++) {
        days.push(dayCounter);
    }

    const currentDays: number[] = [];
    if (currentMonthIsDecember) {
        for (let dayCounter = 1; dayCounter <= endDay; dayCounter++) {
            currentDays.push(dayCounter);
        }
    }

    const data: Map<number, number[]> = new Map<number, number[]>();
    years.forEach(element => {
        data.set(element, days);
    });

    if (years.indexOf(endYear) !== -1) {
        data.set(endYear, currentDays);
    }

    console.log(data);

    return data;
}

function provider(): vscode.TreeDataProvider<{ key: string }> {
    const date: Date = new Date();
    const tree = generateTree(date.getFullYear(), 12 /*date.getMonth()*/, date.getDate());

    return tree;
}
