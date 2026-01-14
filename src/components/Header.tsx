import { Branch, MapPin } from "lucide-react";

export function Header() {
    return (
        <header className={styles.header}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className={styles.logo}>
                        TPL
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <h1 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'white' }}>
                            Study Room Booking
                        </h1>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400 }}>Internal Staff Portal</span>
                    </div>
                    <span className={styles.badge} style={{ marginLeft: '1rem' }}>Staff Only</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                    <MapPin size={16} />
                    <span>Toronto Public Library</span>
                </div>
            </div>
        </header>
    );
}

const styles = {
    header: "tpl-header",
    logo: "tpl-logo",
    badge: "tpl-badge",
} as const;
