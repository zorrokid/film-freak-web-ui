export function storeValue(key: string, value: string) {
    localStorage.setItem(key, value);
}

export function getValue(key: string): string | null {
    return localStorage.getItem(key);
}

export function removeItem(key: string) {
    localStorage.removeItem(key);
}

export function storeObject(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getObject<T>(key: string): T | null {
    const valueStr = localStorage.getItem(key);
    if (!valueStr) return null;
    return JSON.parse(valueStr);
}