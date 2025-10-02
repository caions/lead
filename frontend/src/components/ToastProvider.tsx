'use client';

import { ToastContainer } from '@/components/Toast';
import { ToastProvider as ToastContextProvider, useToastContext } from '@/contexts/ToastContext';

function ToastContainerWrapper() {
  const { toasts, removeToast } = useToastContext();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContextProvider>
      <ToastContainerWrapper />
      {children}
    </ToastContextProvider>
  );
}
