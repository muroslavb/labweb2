// Простір імен (namespace) для групування всієї логіки валідації в одному місці.
// Namespace тут доречний, бо це просто набір пов'язаних функцій без стану,
// які логічно належать одна одній - на відміну від класів/сервісів з власним станом.
export namespace Validation {
  export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
  }

  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  export function isDigitsOnly(value: string): boolean {
    return /^\d+$/.test(value);
  }

  // рік видання: рівно 4 цифри, у розумному діапазоні (від винаходу друку до поточного року)
  export function isValidYear(value: string): boolean {
    if (!/^\d{4}$/.test(value)) return false;
    const year = Number(value);
    const currentYear = new Date().getFullYear();
    return year >= 1450 && year <= currentYear;
  }

  export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  export function validateBook(title: string, author: string, year: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(title)) errors.title = "Це поле є обов'язковим";
    if (!isRequired(author)) errors.author = "Це поле є обов'язковим";

    if (!isRequired(year)) {
      errors.year = "Це поле є обов'язковим";
    } else if (!isValidYear(year)) {
      errors.year = 'Рік видання має бути 4-значним числом у допустимому діапазоні';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  export function validateUser(name: string, email: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(name)) errors.name = "Це поле є обов'язковим";

    if (!isRequired(email)) {
      errors.email = "Це поле є обов'язковим";
    } else if (!isValidEmail(email)) {
      errors.email = 'Введіть коректний email';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // окрема валідація ID користувача (вводиться вручну в модальному вікні позичання)
  export function validateUserId(id: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(id)) {
      errors.id = "Це поле є обов'язковим";
    } else if (!isDigitsOnly(id)) {
      errors.id = 'ID користувача має містити лише цифри';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
