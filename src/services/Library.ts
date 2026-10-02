// Generic-клас Library<T> - вміє керувати колекцією будь-якого типу,
// аби той тип мав властивість "id" (це і забезпечує обмеження extends Identifiable)

export interface Identifiable {
  id: string;
}

export class Library<T extends Identifiable> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(id: string): boolean {
    const lengthBefore = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    return this.items.length < lengthBefore;
  }

  find(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  search(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  getAll(): T[] {
    return [...this.items];
  }

  count(): number {
    return this.items.length;
  }

  setAll(items: T[]): void {
    this.items = items;
  }
}
