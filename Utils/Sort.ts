export function groupByN<Array>(n: number, data: Array[]) {
    const result: Array[][] = [];
    for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
    return result;
};