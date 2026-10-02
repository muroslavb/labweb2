import { ModalButtonConfig } from '../../types';

// Універсальне модальне вікно: використовується і для сповіщень (успішне
// позичання/повернення), і для форми введення ID користувача при позичанні.
// Це наша заміна забороненому window.alert().
export class Modal {
  private overlay: HTMLDivElement;
  private box: HTMLDivElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';

    this.box = document.createElement('div');
    this.box.className = 'modal-box';

    this.overlay.appendChild(this.box);

    // клік по темному фону закриває вікно
    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) this.close();
    });
  }

  show(title: string, bodyHtml: string, buttons: ModalButtonConfig[]): void {
    this.box.innerHTML = `
      <div class="modal-header">
        <h5>${title}</h5>
        <button class="modal-close" aria-label="Закрити">&times;</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-footer"></div>
    `;

    const footer = this.box.querySelector('.modal-footer') as HTMLDivElement;
    buttons.forEach((button) => {
      const el = document.createElement('button');
      el.textContent = button.text;
      el.className = `btn ${button.className ?? 'btn-secondary'}`;
      el.addEventListener('click', button.onClick);
      footer.appendChild(el);
    });

    const closeBtn = this.box.querySelector('.modal-close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.close());

    document.body.appendChild(this.overlay);
  }

  getInputValue(selector: string): string {
    const input = this.box.querySelector(selector) as HTMLInputElement | null;
    return input ? input.value : '';
  }

  showError(selector: string, message: string): void {
    const el = this.box.querySelector(selector);
    if (el) el.textContent = message;
  }

  close(): void {
    if (this.overlay.parentElement) {
      document.body.removeChild(this.overlay);
    }
  }
}
