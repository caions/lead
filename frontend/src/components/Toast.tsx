'use client';

import { useEffect, useState } from 'react';
import Alert from '@/components/Alert';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export default function Toast({
  type,
  message,
  duration = 5000,
  onClose,
  className = ''
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Aguarda animação de saída
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } ${className}`}>
      <Alert
        type={type}
        onClose={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="shadow-lg"
      >
        {message}
      </Alert>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
          className={`transform transition-all duration-300 ${
            index === 0 ? 'translate-x-0' : `translate-x-${index * 4}`
          }`}
        />
      ))}
    </div>
  );
}
