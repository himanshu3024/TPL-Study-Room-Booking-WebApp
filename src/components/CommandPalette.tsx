"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Calendar, Clock, User } from "lucide-react";
import { useBookingStore } from "@/lib/store";
import { useToast } from "@/components/ui/ToastProvider";

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { branches, setSelectedBranchId, bookings, setSelectedDate } = useBookingStore();
    const { addToast } = useToast();

    // Toggle on Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Filter Results
    const filteredBranches = useMemo(() => {
        if (!query) return [];
        return branches
            .filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    }, [branches, query]);

    const filteredBookings = useMemo(() => {
        if (!query) return [];
        return bookings
            .filter((b) => b.userName.toLowerCase().includes(query.toLowerCase()) || b.userId.includes(query))
            .slice(0, 5);
    }, [bookings, query]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 9999,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "10vh",
                backdropFilter: "blur(2px)"
            }}
            onClick={() => setIsOpen(false)}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    animation: "scaleIn 0.1s ease-out"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e2e8f0", padding: "1rem" }}>
                    <Search size={20} color="#64748b" />
                    <input
                        autoFocus
                        placeholder="Search branches or existing bookings..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "1.1rem",
                            paddingLeft: "1rem",
                            color: "#1e293b"
                        }}
                    />
                    <div style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "4px", color: "#64748b" }}>ESC</div>
                </div>

                <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0.5rem" }}>
                    {!query && (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                            <p>Type to search...</p>
                            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Try "Albion" or "John"</p>
                        </div>
                    )}

                    {filteredBranches.length > 0 && (
                        <div style={{ marginBottom: "0.5rem" }}>
                            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem 1rem", textTransform: "uppercase" }}>Branches</div>
                            {filteredBranches.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="cmd-item"
                                    onClick={() => {
                                        setSelectedBranchId(branch.id);
                                        setIsOpen(false);
                                        addToast(`Switched to ${branch.name}`, "info");
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "0.75rem 1rem",
                                        cursor: "pointer",
                                        borderRadius: "6px",
                                        transition: "background 0.1s"
                                    }}
                                >
                                    <MapPin size={16} color="var(--color-tpl-blue)" />
                                    <span>{branch.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredBookings.length > 0 && (
                        <div>
                            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", padding: "0.5rem 1rem", textTransform: "uppercase" }}>Bookings</div>
                            {filteredBookings.map((b) => (
                                <div
                                    key={b.id}
                                    className="cmd-item"
                                    onClick={() => {
                                        setSelectedBranchId(b.branchId);
                                        setSelectedDate(b.date);
                                        setIsOpen(false);
                                        addToast(`Viewing booking for ${b.userName}`, "info");
                                        // Optionally scroll to booking logic here
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "0.75rem 1rem",
                                        cursor: "pointer",
                                        borderRadius: "6px"
                                    }}
                                >
                                    <User size={16} color="var(--color-tpl-purple)" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{b.userName}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{b.date} • {b.startTime}-{b.endTime}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .cmd-item:hover {
            background-color: #f1f5f9;
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
