import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastAlertProps { message: string; onClose: () => void; }

const ToastAlert: React.FC<ToastAlertProps> = ({ message, onClose }) => (
  <div role="status" className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-500/25 bg-card p-4 text-sm shadow-xl animate-fadeIn">
    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" /><span className="flex-1">{message}</span><button onClick={onClose} aria-label="Close notification" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
  </div>
);

export default ToastAlert;