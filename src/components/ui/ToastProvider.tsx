"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
    id: string;
    message: string;
    type: ToastType;
    undoAction?: () => void;
};

type ToastContextType = {
    addToast: (message: string, type?: ToastType, undoAction?: () => void) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = "info", undoAction?: () => void) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type, undoAction }]);

        // Auto remove after 5s
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                zIndex: 9999,
                pointerEvents: 'none' // Allow clicks through container
            }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="toast-enter"
                        style={{
                            background: 'white',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            borderLeft: `4px solid ${toast.type === 'success' ? 'var(--color-success)' :
                                    toast.type === 'error' ? 'var(--color-danger)' :
                                        'var(--color-tpl-blue)'
                                }`,
                            borderRadius: '8px',
                            padding: '1rem',
                            minWidth: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            pointerEvents: 'auto', // Re-enable clicks
                            animation: 'slideIn 0.3s ease-out forwards',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Icon */}
                        <div>
                            {toast.type === 'success' && <CheckCircle size={20} color="var(--color-success)" />}
                            {toast.type === 'error' && <AlertCircle size={20} color="var(--color-danger)" />}
                            {toast.type === 'info' && <Info size={20} color="var(--color-tpl-blue)" />}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{toast.message}</p>
                        </div>

                        {/* Undo Action */}
                        {toast.undoAction && (
                            <button
                                onClick={() => {
                                    toast.undoAction!();
                                    removeToast(toast.id);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-secondary)',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Undo
                            </button>
                        )}

                        {/* Close */}
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
