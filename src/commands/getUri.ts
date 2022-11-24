const base: string = 'adventofcode.com';

export function getUri(year: number, day: number) {
    return `https://${base}/${year}/day/${day}`;
}