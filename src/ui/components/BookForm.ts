import { Validation } from '../../utils/validators';

export interface BookFormData {
  title: string;
  author: string;
  year: string;
}

// Форма генерується виключно через JS (жодної розмітки в index.html)
export function createBookForm(onSubmit: (data: BookFormData) => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-4';
  wrapper.innerHTML = `
    <h4>Додати Книгу</h4>
    <input type="text" class="form-control mb-1" id="book-title" placeholder="Назва книги" />
    <div class="text-danger small mb-2" id="book-title-error"></div>
    <input type="text" class="form-control mb-1" id="book-author" placeholder="Автор" />
    <div class="text-danger small mb-2" id="book-author-error"></div>
    <input type="text" class="form-control mb-1" id="book-year" placeholder="Рік видання" />
    <div class="text-danger small mb-2" id="book-year-error"></div>
    <button class="btn btn-success" id="book-submit">Додати Книгу</button>
  `;

  const titleInput = wrapper.querySelector('#book-title') as HTMLInputElement;
  const authorInput = wrapper.querySelector('#book-author') as HTMLInputElement;
  const yearInput = wrapper.querySelector('#book-year') as HTMLInputElement;
  const submitBtn = wrapper.querySelector('#book-submit') as HTMLButtonElement;

  const titleError = wrapper.querySelector('#book-title-error') as HTMLDivElement;
  const authorError = wrapper.querySelector('#book-author-error') as HTMLDivElement;
  const yearError = wrapper.querySelector('#book-year-error') as HTMLDivElement;

  submitBtn.addEventListener('click', () => {
    const data: BookFormData = {
      title: titleInput.value,
      author: authorInput.value,
      year: yearInput.value,
    };

    const result = Validation.validateBook(data.title, data.author, data.year);
    titleError.textContent = result.errors.title ?? '';
    authorError.textContent = result.errors.author ?? '';
    yearError.textContent = result.errors.year ?? '';

    if (!result.isValid) return;

    onSubmit(data);
    titleInput.value = '';
    authorInput.value = '';
    yearInput.value = '';
  });

  return wrapper;
}
