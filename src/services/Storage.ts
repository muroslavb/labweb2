// Обгортка над LocalStorage: зберігає й читає дані у форматі JSON,
// типізована через generics, щоб не втрачати типи при збереженні/читанні.

export class Storage {
  static save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static load<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
