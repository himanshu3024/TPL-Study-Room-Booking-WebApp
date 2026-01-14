"use client";

import { BookingProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { Header } from "@/components/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <BookingProvider>
            <ToastProvider>
                <CommandPalette />
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <main className="container" style={{ flex: 1, padding: '2rem 1.5rem' }}>
                        {children}
                    </main>

                    <footer style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.875rem',
                        borderTop: '1px solid var(--color-border)',
                        background: 'white',
                        marginTop: 'auto'
                    }}>
                        <p>© 2026 Toronto Public Library • Staff Internal System</p>
                    </footer>
                </div>
            </ToastProvider>
        </BookingProvider>
    );
}
