import { User } from '../../models/User';

const PAGE_SIZE = 5;

export function createUserList(
  users: User[],
  page: number,
  onPageChange: (page: number) => void,
  onDelete: (userId: string) => void
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-4';

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const rowsHtml = pageItems
    .map(
      (user) => `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <span>${user.getDisplayName()} — позичено: ${user.borrowedBookIds.length}/3</span>
          <button class="btn btn-outline-danger btn-sm" data-id="${user.id}">✕</button>
        </div>
      `
    )
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
    <h4>Список Користувачів</h4>
    ${pageItems.length ? rowsHtml : '<p class="text-muted">Користувачів немає</p>'}
    <div class="mt-3">${paginationHtml}</div>
  `;

  wrapper.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => onDelete(btn.getAttribute('data-id') as string));
  });

  wrapper.querySelectorAll('button[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => onPageChange(Number(btn.getAttribute('data-page'))));
  });

  return wrapper;
}
