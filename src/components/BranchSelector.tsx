"use client";

import React, { useCallback } from "react";
import { useBookingStore } from "@/lib/store";
import { Building2, ChevronDown, Calendar, Clock, MapPin, Zap } from "lucide-react";
import { format } from "date-fns";
import { WeeklyHours } from "@/data/branches";
import { useToast } from "@/components/ui/ToastProvider";

export function BranchSelector({ onNextAvailable }: { onNextAvailable?: (roomId: string, time: string) => void }) {
    const { branches, selectedBranchId, setSelectedBranchId, selectedDate, setSelectedDate, getBranch, bookings } = useBookingStore();
    const { addToast } = useToast();

    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    // Get hours for selected date
    const [y, m, d] = selectedDate.split('-').map(Number);
    const localDate = new Date(y, m - 1, d);
    const dayName = format(localDate, 'EEEE') as keyof WeeklyHours;
    const todayHours = selectedBranch?.hours ? selectedBranch.hours[dayName] : null;

    // --- NEXT AVAILABLE LOGIC ---
    const handleFindNextAvailable = useCallback(() => {
        if (!selectedBranch || !todayHours) {
            addToast("Branch is closed today.", "error");
            return;
        }

        const branch = getBranch(selectedBranchId);
        if (!branch || branch.rooms.length === 0) {
            addToast("No rooms in this branch.", "error");
            return;
        }

        // Logic: Find first 60m slot starting from NOW (rounded up to nearest 5m)
        const now = new Date();
        const currentH = now.getHours();
        const currentM = Math.ceil(now.getMinutes() / 5) * 5; // Round to next 5m

        const [openH, openM] = todayHours.open.split(':').map(Number);
        const [closeH, closeM] = todayHours.close.split(':').map(Number);

        // If current time is past closing, abort
        if (currentH > closeH || (currentH === closeH && currentM >= closeM)) {
            addToast("Branch is closed for the day.", "error");
            return;
        }

        // Calculate start minutes from midnight
        let searchStartMins = Math.max(currentH * 60 + currentM, openH * 60 + openM);
        const endMins = closeH * 60 + closeM;
        const duration = 60; // Looking for 1 hour slot

        // Iterate through time slots (every 15 mins for efficiency) to find a gap
        // Simple greedy search: Check each room for a gap at 'searchStartMins'

        // We'll check every 15 minutes from now until closing
        for (let t = searchStartMins; t <= endMins - duration; t += 15) {
            // Current check time string "HH:mm"
            const checkH = Math.floor(t / 60);
            const checkM = t % 60;
            const startTimeStr = `${checkH.toString().padStart(2, '0')}:${checkM.toString().padStart(2, '0')}`;

            const checkEndT = t + duration;
            const checkEndH = Math.floor(checkEndT / 60);
            const checkEndM = checkEndT % 60;
            const endTimeStr = `${checkEndH.toString().padStart(2, '0')}:${checkEndM.toString().padStart(2, '0')}`;

            // Check availability for all rooms at this time
            for (const room of branch.rooms) {
                const hasConflict = bookings.some(b =>
                    b.branchId === selectedBranchId &&
                    b.roomId === room.id &&
                    b.date === selectedDate &&
                    b.status === 'active' &&
                    (
                        (startTimeStr >= b.startTime && startTimeStr < b.endTime) ||
                        (endTimeStr > b.startTime && endTimeStr <= b.endTime) ||
                        (startTimeStr <= b.startTime && endTimeStr >= b.endTime)
                    )
                );

                if (!hasConflict) {
                    // FOUND ONE!
                    if (onNextAvailable) {
                        onNextAvailable(room.id, startTimeStr);
                        addToast(`Found: ${room.name} at ${startTimeStr}`, "success");
                    }
                    return;
                }
            }
        }

        addToast("No 1-hour slots available for the rest of the day.", "error");

    }, [selectedBranch, todayHours, bookings, selectedBranchId, selectedDate, onNextAvailable, getBranch, addToast]);

    return (
        <div className="card" style={{ width: '100%', marginBottom: '2rem', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* Branch Select */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label style={{
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 700,
                            color: 'var(--color-text-secondary)',
                        }}>
                            Select Branch Location
                        </label>
                        {/* Weather Widget Removed */}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '1.25rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-tpl-blue)',
                            pointerEvents: 'none'
                        }}>
                            <Building2 size={24} />
                        </div>

                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem 1rem 3.5rem',
                                fontSize: '1.1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                appearance: 'none',
                                backgroundColor: 'var(--color-bg-page)',
                                cursor: 'pointer',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)'
                            }}
                        >
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>

                        <div style={{
                            position: 'absolute',
                            right: '1.25rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: 'var(--color-text-secondary)'
                        }}>
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {selectedBranch && (
                        <div style={{
                            marginTop: '1.5rem',
                            display: 'flex',
                            gap: '1rem',
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.9rem',
                            alignItems: 'center'
                        }}>
                            <MapPin size={16} />
                            <span>{selectedBranch.address}</span>
                        </div>
                    )}
                </div>

                {/* Date Select & Next Available */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.75rem'
                    }}>
                        Booking Controls
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--color-tpl-blue)',
                                pointerEvents: 'none'
                            }}>
                                <Calendar size={20} />
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1.25rem 0.75rem 3.5rem',
                                    fontSize: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-page)',
                                    fontFamily: 'inherit',
                                    fontWeight: 600,
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>

                        <button
                            className="btn"
                            onClick={handleFindNextAvailable}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(to right, #682c91, #8b5cf6)' // Purple for primary action
                            }}
                        >
                            <Zap size={16} fill="white" /> Find Next Available
                        </button>
                    </div>

                    {selectedBranch && (
                        <div style={{
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.5rem',
                            color: todayHours ? 'var(--color-success)' : 'var(--color-danger)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            alignItems: 'center'
                        }}>
                            <Clock size={16} />
                            <span>
                                {dayName}: {todayHours ? `${todayHours.open} - ${todayHours.close}` : "Closed"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
