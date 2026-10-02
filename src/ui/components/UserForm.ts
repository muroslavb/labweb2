import { Validation } from '../../utils/validators';

export interface UserFormData {
  name: string;
  email: string;
}

export function createUserForm(onSubmit: (data: UserFormData) => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-4';
  wrapper.innerHTML = `
    <h4>Додати Користувача</h4>
    <input type="text" class="form-control mb-1" id="user-name" placeholder="Ім'я" />
    <div class="text-danger small mb-2" id="user-name-error"></div>
    <input type="text" class="form-control mb-1" id="user-email" placeholder="Email" />
    <div class="text-danger small mb-2" id="user-email-error"></div>
    <button class="btn btn-success" id="user-submit">Додати Користувача</button>
  `;

  const nameInput = wrapper.querySelector('#user-name') as HTMLInputElement;
  const emailInput = wrapper.querySelector('#user-email') as HTMLInputElement;
  const submitBtn = wrapper.querySelector('#user-submit') as HTMLButtonElement;

  const nameError = wrapper.querySelector('#user-name-error') as HTMLDivElement;
  const emailError = wrapper.querySelector('#user-email-error') as HTMLDivElement;

  submitBtn.addEventListener('click', () => {
    const data: UserFormData = { name: nameInput.value, email: emailInput.value };

    const result = Validation.validateUser(data.name, data.email);
    nameError.textContent = result.errors.name ?? '';
    emailError.textContent = result.errors.email ?? '';

    if (!result.isValid) return;

    onSubmit(data);
    nameInput.value = '';
    emailInput.value = '';
  });

  return wrapper;
}
