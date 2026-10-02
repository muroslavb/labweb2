import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  describe('validateBook', () => {
    it('повертає помилку, якщо назва порожня', () => {
      const result = Validation.validateBook('', 'Автор', '2020');
      expect(result.isValid).to.equal(false);
      expect(result.errors.title).to.be.a('string');
    });

    it('повертає помилку для некоректного року', () => {
      const result = Validation.validateBook('Назва', 'Автор', 'abcd');
      expect(result.isValid).to.equal(false);
      expect(result.errors.year).to.be.a('string');
    });

    it('проходить валідацію з коректними даними', () => {
      const result = Validation.validateBook('Кобзар', 'Шевченко', '1840');
      expect(result.isValid).to.equal(true);
    });
  });

  describe('validateUser', () => {
    it('повертає помилку для некоректного email', () => {
      const result = Validation.validateUser("Ім'я", 'not-an-email');
      expect(result.isValid).to.equal(false);
      expect(result.errors.email).to.be.a('string');
    });

    it('проходить валідацію з коректними даними', () => {
      const result = Validation.validateUser('Оксана', 'oksana@example.com');
      expect(result.isValid).to.equal(true);
    });
  });

  describe('validateUserId', () => {
    it('відхиляє id з буквами', () => {
      const result = Validation.validateUserId('12a34');
      expect(result.isValid).to.equal(false);
    });

    it('приймає id з самих цифр', () => {
      const result = Validation.validateUserId('12345');
      expect(result.isValid).to.equal(true);
    });
  });
});
