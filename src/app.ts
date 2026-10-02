import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { Book } from './models/Book';
import { User } from './models/User';
import { IBook } from './models/interfaces/IBook';
import { IUser } from './models/interfaces/IUser';
import { Library } from './services/Library';
import { Storage } from './services/Storage';
import { generateId } from './utils/idGenerator';
import { Validation } from './utils/validators';
import { Modal } from './ui/components/Modal';
import { createBookForm } from './ui/components/BookForm';
import { createUserForm } from './ui/components/UserForm';
import { createBookList } from './ui/components/BookList';
import { createUserList } from './ui/components/UserList';

const BOOKS_KEY = 'library.books';
const USERS_KEY = 'library.users';

class App {
  private bookLibrary = new Library<Book>();
  private userLibrary = new Library<User>();
  private modal = new Modal();
  private root: HTMLElement;

  private bookPage = 1;
  private userPage = 1;
  private bookSearch = '';

  constructor(rootId: string) {
    this.root = document.getElementById(rootId) as HTMLElement;
    this.loadFromStorage();
    this.render();
  }

  private loadFromStorage(): void {
    const books = Storage.load<IBook[]>(BOOKS_KEY) ?? [];
    const users = Storage.load<IUser[]>(USERS_KEY) ?? [];
    this.bookLibrary.setAll(books.map(Book.fromPlainObject));
    this.userLibrary.setAll(users.map(User.fromPlainObject));
  }

  private persist(): void {
    Storage.save(BOOKS_KEY, this.bookLibrary.getAll());
    Storage.save(USERS_KEY, this.userLibrary.getAll());
  }

  private render(): void {
    this.root.innerHTML = '';

    const title = document.createElement('h1');
    title.className = 'text-center my-4';
    title.textContent = 'Система Управління Бібліотекою';
    this.root.appendChild(title);

    this.root.appendChild(
      createBookForm((data) => {
        const book = new Book(generateId(), data.title, data.author, Number(data.year));
        this.bookLibrary.add(book);
        this.persist();
        this.render();
      })
    );

    this.root.appendChild(
      createUserForm((data) => {
        const user = new User(generateId(), data.name, data.email);
        this.userLibrary.add(user);
        this.persist();
        this.render();
      })
    );

    const query = this.bookSearch.toLowerCase();
    const filteredBooks = query
      ? this.bookLibrary.search(
          (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
        )
      : this.bookLibrary.getAll();

    this.root.appendChild(
      createBookList(
        filteredBooks,
        this.bookPage,
        (page) => {
          this.bookPage = page;
          this.render();
        },
        {
          onBorrow: (bookId) => this.openBorrowModal(bookId),
          onReturn: (bookId) => this.returnBook(bookId),
          onDelete: (bookId) => this.deleteBook(bookId),
        },
        this.bookSearch,
        (searchValue) => {
          this.bookSearch = searchValue;
          this.bookPage = 1;
          this.renderPreservingFocus();
        }
      )
    );

    this.root.appendChild(
      createUserList(
        this.userLibrary.getAll(),
        this.userPage,
        (page) => {
          this.userPage = page;
          this.render();
        },
        (userId) => this.deleteUser(userId)
      )
    );
  }

  /**
   * Re-renders the whole app (same as render()) but keeps focus, caret
   * position and scroll position intact. Needed because render() replaces
   * root.innerHTML entirely, which normally destroys the currently
   * focused element (e.g. the search input) and resets scroll to top.
   */
  private renderPreservingFocus(): void {
    const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    const activeId = active && active.id ? active.id : null;
    const canSelect = !!active && typeof (active as HTMLInputElement).setSelectionRange === 'function';
    const selStart = canSelect ? (active as HTMLInputElement).selectionStart : null;
    const selEnd = canSelect ? (active as HTMLInputElement).selectionEnd : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    this.render();

    if (activeId) {
      const el = document.getElementById(activeId) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) {
        el.focus();
        if (selStart !== null && selEnd !== null && typeof (el as HTMLInputElement).setSelectionRange === 'function') {
          try {
            (el as HTMLInputElement).setSelectionRange(selStart, selEnd);
          } catch {
            // ignore: some input types don't support selection ranges
          }
        }
      }
    }

    window.scrollTo(scrollX, scrollY);
  }

  private openBorrowModal(bookId: string): void {
    const book = this.bookLibrary.find(bookId);
    if (!book) return;

    this.modal.show(
      'Введіть ID користувача для позичення книги:',
      `<input type="text" class="form-control" id="borrow-user-id" placeholder="ID" />
       <div class="text-danger small mt-2" id="borrow-error"></div>`,
      [
        { text: 'Скасувати', className: 'btn-secondary', onClick: () => this.modal.close() },
        { text: 'Зберегти', className: 'btn-primary', onClick: () => this.confirmBorrow(book) },
      ]
    );
  }

  private confirmBorrow(book: Book): void {
    const id = this.modal.getInputValue('#borrow-user-id').trim();
    const idValidation = Validation.validateUserId(id);

    if (!idValidation.isValid) {
      this.modal.showError('#borrow-error', idValidation.errors.id);
      return;
    }

    const user = this.userLibrary.find(id);
    if (!user) {
      this.modal.showError('#borrow-error', 'Користувача з таким ID не знайдено');
      return;
    }

    if (!user.canBorrowMore()) {
      this.modal.showError('#borrow-error', 'Цей користувач вже позичив максимум 3 книги');
      return;
    }

    book.markAsBorrowed(user.id);
    user.addBorrowedBook(book.id);
    this.persist();
    this.modal.close();

    this.modal.show(
      'Готово!',
      `<p>${book.getSummary()} has been borrowed by ${user.getDisplayName()}.</p>`,
      [
        {
          text: 'Зрозуміло!',
          className: 'btn-primary',
          onClick: () => {
            this.modal.close();
            this.render();
          },
        },
      ]
    );
  }

  private returnBook(bookId: string): void {
    const book = this.bookLibrary.find(bookId);
    if (!book || !book.borrowedBy) return;

    const user = this.userLibrary.find(book.borrowedBy);
    book.markAsReturned();
    if (user) user.removeBorrowedBook(bookId);
    this.persist();

    this.modal.show('Готово!', `<p>${book.getSummary()} has been returned.</p>`, [
      {
        text: 'Закрити',
        className: 'btn-primary',
        onClick: () => {
          this.modal.close();
          this.render();
        },
      },
    ]);
  }

  private deleteBook(bookId: string): void {
    this.bookLibrary.remove(bookId);
    this.persist();
    this.render();
  }

  private deleteUser(userId: string): void {
    this.userLibrary.remove(userId);
    this.persist();
    this.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App('app');
});
