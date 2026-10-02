// Генерує унікальний числовий ID - поточний час у мілісекундах + випадкові цифри.
// Це гарантує, що ID завжди складається лише з цифр (потрібно для валідації).
export function generateId(): string {
  const timestamp = Date.now().toString();
  const randomPart = Math.floor(Math.random() * 1000).toString();
  return timestamp + randomPart;
}
