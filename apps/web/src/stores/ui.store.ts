import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastState {
  open: boolean;
  title?: string;
  description?: string;
  variant: ToastVariant;
}

export interface ModalState {
  open: boolean;
  title: string;
  description: string;
}

interface UiStore {
  toast: ToastState;
  modal: ModalState;
  
  showToast: (options: Omit<ToastState, 'open'>) => void;
  hideToast: () => void;
  
  showModal: (options: Omit<ModalState, 'open'>) => void;
  hideModal: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  toast: {
    open: false,
    variant: 'default',
  },
  modal: {
    open: false,
    title: '',
    description: '',
  },

  showToast: (options) =>
    set(() => ({
      toast: { ...options, open: true },
    })),
    
  hideToast: () =>
    set((state) => ({
      toast: { ...state.toast, open: false },
    })),

  showModal: (options) =>
    set(() => ({
      modal: { ...options, open: true },
    })),
    
  hideModal: () =>
    set((state) => ({
      modal: { ...state.modal, open: false },
    })),
}));
