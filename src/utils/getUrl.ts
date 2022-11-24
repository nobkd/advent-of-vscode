const base: string = 'adventofcode.com';

export function getUrl(year: number, day: number, data: boolean) {
    return `https://${base}/${year}/day/${day}${data ? '/input' : ''}`;
}
