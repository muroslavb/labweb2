import { Book } from '../../models/Book';

export interface BookListCallbacks {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
}

const PAGE_SIZE = 5;

export function createBookList(
  books: Book[],
  page: number,
  onPageChange: (page: number) => void,
  callbacks: BookListCallbacks,
  searchQuery: string,
  onSearch: (query: string) => void
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-4';

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = books.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const rowsHtml = pageItems
    .map((book) => {
      const actionBtn = book.isBorrowed
        ? `<button class="btn btn-warning btn-sm" data-action="return" data-id="${book.id}">Повернути</button>`
        : `<button class="btn btn-primary btn-sm" data-action="borrow" data-id="${book.id}">Позичити</button>`;

      return `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <span>${book.getSummary()}</span>
          <div>
            ${actionBtn}
            <button class="btn btn-outline-danger btn-sm ms-1" data-action="delete" data-id="${book.id}">✕</button>
          </div>
        </div>
      `;
    })
    .join('');

  const paginationHtml = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(
      (p) =>
        `<button class="btn btn-sm ${
          p === currentPage ? 'btn-dark' : 'btn-outline-dark'
        } me-1" data-page="${p}">${p}</button>`
    )
    .join('');

  wrapper.innerHTML = `
    <h4>Список Книг</h4>
    <input type="text" class="form-control mb-3" id="book-search"
           placeholder="Пошук за назвою або автором" value="${searchQuery}" />
    ${pageItems.length ? rowsHtml : '<p class="text-muted">Книг не знайдено</p>'}
    <div class="mt-3">${paginationHtml}</div>
  `;

  wrapper.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id') as string;
      if (action === 'borrow') callbacks.onBorrow(id);
      if (action === 'return') callbacks.onReturn(id);
      if (action === 'delete') callbacks.onDelete(id);
    });
  });

  wrapper.querySelectorAll('button[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => onPageChange(Number(btn.getAttribute('data-page'))));
  });

  const searchInput = wrapper.querySelector('#book-search') as HTMLInputElement;
  searchInput.addEventListener('input', () => onSearch(searchInput.value));

  return wrapper;
}
