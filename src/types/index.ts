export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface ModalButtonConfig {
  text: string;
  className?: string;
  onClick: () => void;
}
