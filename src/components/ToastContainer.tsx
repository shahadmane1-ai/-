import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { Language } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'peace' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  lang: Language;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  lang,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 select-none"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
      case 'peace':
        return {
          bg: 'bg-white/95 border-[#88C947] text-[#2C483F]',
          icon: <Sparkles className="w-4 h-4 text-[#88C947] shrink-0" />,
          glow: 'shadow-gold',
        };
      case 'warning':
        return {
          bg: 'bg-white/95 border-amber-400 text-[#2C483F]',
          icon: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
          glow: 'shadow-soft',
        };
      case 'info':
      default:
        return {
          bg: 'bg-white/95 border-[#D4A373] text-[#2C483F]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#D4A373] shrink-0" />,
          glow: 'shadow-soft',
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md shadow-soft-lg transform transition-all duration-300 animate-fade-in ${style.bg} ${style.glow}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1 text-xs">
        {toast.title && <div className="font-black text-[#2C483F] mb-0.5">{toast.title}</div>}
        <div className="text-stone-700 leading-relaxed font-medium">{toast.message}</div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-stone-400 hover:text-stone-600 p-0.5 rounded-lg transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
