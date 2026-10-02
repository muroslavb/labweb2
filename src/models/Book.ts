import { IBook } from './interfaces/IBook';

export class Book implements IBook {
  public isBorrowed: boolean;
  public borrowedBy: string | null;

  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    isBorrowed = false,
    borrowedBy: string | null = null
  ) {
    this.isBorrowed = isBorrowed;
    this.borrowedBy = borrowedBy;
  }

  // короткий підсумок для відображення в списку
  getSummary(): string {
    return `${this.title} by ${this.author} (${this.year})`;
  }

  markAsBorrowed(userId: string): void {
    this.isBorrowed = true;
    this.borrowedBy = userId;
  }

  markAsReturned(): void {
    this.isBorrowed = false;
    this.borrowedBy = null;
  }

  // відновлення класу з "голого" об'єкта (наприклад, після зчитування з LocalStorage)
  static fromPlainObject(data: IBook): Book {
    return new Book(data.id, data.title, data.author, data.year, data.isBorrowed, data.borrowedBy);
  }
}
