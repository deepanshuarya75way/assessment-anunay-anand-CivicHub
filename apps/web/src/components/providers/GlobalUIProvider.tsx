import React from 'react';
import { 
  ToastProvider, 
  Toast, 
  ToastTitle, 
  ToastDescription, 
  ToastViewport,
  GlassDialog,
  GlassDialogContent,
  GlassDialogHeader,
  GlassDialogTitle,
  GlassDialogDescription,
  GlassDialogFooter,
  GlassButton
} from '@civichub/ui';
import { useUiStore } from '../../stores/ui.store';

export const GlobalUIProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast, modal, hideToast, hideModal } = useUiStore();

  return (
    <ToastProvider swipeDirection="right">
      {children}

      {/* Global Toast */}
      <Toast
        open={toast.open}
        onOpenChange={(open) => !open && hideToast()}
        variant={toast.variant}
      >
        {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
        {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
      </Toast>
      
      {/* Toast Viewport (where toasts appear on screen) */}
      <ToastViewport />

      {/* Global Error Modal */}
      <GlassDialog open={modal.open} onOpenChange={(open) => !open && hideModal()}>
        <GlassDialogContent className="sm:max-w-md">
          <GlassDialogHeader>
            <GlassDialogTitle className="text-red-400">{modal.title}</GlassDialogTitle>
            <GlassDialogDescription>
              We encountered a problem that needs your attention.
            </GlassDialogDescription>
          </GlassDialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-300">{modal.description}</p>
          </div>
          <GlassDialogFooter>
            <GlassButton variant="secondary" onClick={hideModal}>
              Close
            </GlassButton>
          </GlassDialogFooter>
        </GlassDialogContent>
      </GlassDialog>
    </ToastProvider>
  );
};
