'use client';

import { ToastContainer } from '@/components/Toast';
import { ToastProvider as ToastContextProvider, useToastContext } from '@/contexts/ToastContext';
import ClientOnly from './ClientOnly';

interface ToastProviderProps {
  readonly children: React.ReactNode;
}

function ToastContainerWrapper() {
  const { toasts, removeToast } = useToastContext();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastContextProvider>
      <ClientOnly>
        <ToastContainerWrapper />
      </ClientOnly>
      {children}
    </ToastContextProvider>
  );
}
