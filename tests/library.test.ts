import { expect } from 'chai';
import { Library } from '../src/services/Library';

interface TestItem {
  id: string;
  value: string;
}

describe('Library<T>', () => {
  it('додає елемент у колекцію', () => {
    const library = new Library<TestItem>();
    library.add({ id: '1', value: 'a' });
    expect(library.count()).to.equal(1);
  });

  it('знаходить елемент за id', () => {
    const library = new Library<TestItem>();
    library.add({ id: '1', value: 'a' });
    const found = library.find('1');
    expect(found?.value).to.equal('a');
  });

  it('повертає undefined, якщо елемент не знайдено', () => {
    const library = new Library<TestItem>();
    expect(library.find('unknown')).to.equal(undefined);
  });

  it('видаляє елемент за id', () => {
    const library = new Library<TestItem>();
    library.add({ id: '1', value: 'a' });
    const removed = library.remove('1');
    expect(removed).to.equal(true);
    expect(library.count()).to.equal(0);
  });

  it('не ламається, якщо видаляти неіснуючий id', () => {
    const library = new Library<TestItem>();
    const removed = library.remove('unknown');
    expect(removed).to.equal(false);
  });

  it('шукає елементи за предикатом', () => {
    const library = new Library<TestItem>();
    library.add({ id: '1', value: 'apple' });
    library.add({ id: '2', value: 'banana' });
    const result = library.search((item) => item.value.startsWith('a'));
    expect(result.length).to.equal(1);
    expect(result[0].id).to.equal('1');
  });
});
