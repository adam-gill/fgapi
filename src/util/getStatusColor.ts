export function getStatusColor(status: number): string {
    const dot = "\u25CF";
    if (status >= 200 && status < 300) {
        return `\x1b[32m${dot}\x1b[0m`;
    } else if (status >= 300 && status < 400) {
        return `\x1b[33m${dot}\x1b[0m`;
    } else if (status >= 400 && status < 500) {
        return `\x1b[31m${dot}\x1b[0m`;
    }
    return dot;
}