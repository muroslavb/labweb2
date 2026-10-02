import { IUser } from './interfaces/IUser';

export const MAX_BORROWED_BOOKS = 3;

export class User implements IUser {
  public borrowedBookIds: string[];

  constructor(
    public id: string,
    public name: string,
    public email: string,
    borrowedBookIds: string[] = []
  ) {
    this.borrowedBookIds = borrowedBookIds;
  }

  getDisplayName(): string {
    return `${this.id} ${this.name} (${this.email})`;
  }

  canBorrowMore(): boolean {
    return this.borrowedBookIds.length < MAX_BORROWED_BOOKS;
  }

  addBorrowedBook(bookId: string): void {
    this.borrowedBookIds.push(bookId);
  }

  removeBorrowedBook(bookId: string): void {
    this.borrowedBookIds = this.borrowedBookIds.filter((id) => id !== bookId);
  }

  static fromPlainObject(data: IUser): User {
    return new User(data.id, data.name, data.email, data.borrowedBookIds);
  }
}
