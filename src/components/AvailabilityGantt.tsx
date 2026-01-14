"use client";

import { useBookingStore } from "@/lib/store";
import { PIXELS_PER_MINUTE } from "@/lib/utils";
import { format, addMinutes, set, isSameDay } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { WeeklyHours } from "@/data/branches";
import { AlertCircle, CalendarX, Info, Plug, Monitor, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export function AvailabilityGantt({ onSlotClick, onBookingClick }: { onSlotClick: (roomId: string, time: string) => void, onBookingClick: (bookingId: string) => void }) {
    const { selectedBranchId, bookings, getBranch, selectedDate } = useBookingStore();

    // Skeleton Loading Simulation
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [selectedBranchId, selectedDate]);

    // Current Time for Red Line
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const branch = getBranch(selectedBranchId);

    const { timeSlots, todayHours, isClosed } = useMemo(() => {
        if (!branch) return { timeSlots: [], todayHours: null, isClosed: true };
        if (!selectedDate) return { timeSlots: [], todayHours: null, isClosed: true };

        // Safety check date format
        const [y, m, d] = selectedDate.split('-').map(Number);
        const localDate = new Date(y, m - 1, d);

        const dayName = format(localDate, 'EEEE') as keyof WeeklyHours;
        const hours = branch.hours[dayName];

        if (!hours) return { timeSlots: [], todayHours: null, isClosed: true };

        const [openH, openM] = hours.open.split(':').map(Number);
        const [closeH, closeM] = hours.close.split(':').map(Number);

        const slots = [];
        const baseDate = set(new Date(), { hours: openH, minutes: openM, seconds: 0 });
        const totalMins = (closeH * 60 + closeM) - (openH * 60 + openM);
        // Generate every 5 mins
        for (let i = 0; i <= totalMins / 5; i++) {
            slots.push(format(addMinutes(baseDate, i * 5), "HH:mm"));
        }

        return {
            timeSlots: slots,
            todayHours: hours,
            isClosed: false
        };
    }, [branch, selectedDate]);

    // SKELETON RENDER
    if (isLoading) {
        return (
            <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)', width: '100%', minHeight: '600px' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width={200} height={28} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Skeleton width={100} height={20} />
                            <Skeleton width={100} height={20} />
                        </div>
                    </div>
                </div>
                <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ width: '180px' }}>
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} height={60} style={{ marginBottom: '1rem' }} />)}
                        </div>
                        <div style={{ flex: 1 }}>
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} height={60} style={{ marginBottom: '1rem' }} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!branch) return null;

    // Filter bookings logic moved here to be available if needed
    const branchBookings = bookings.filter(b =>
        b.branchId === selectedBranchId &&
        b.date === selectedDate &&
        b.status === 'active'
    );

    const getLeftOffset = (timeStr: string) => {
        if (!todayHours) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        const [openH, openM] = todayHours.open.split(':').map(Number);
        const totalMinutes = (hours - openH) * 60 + (minutes - openM);
        return totalMinutes * PIXELS_PER_MINUTE;
    };

    const getNowOffset = () => {
        if (!todayHours) return -1;
        const [y, m, d] = selectedDate.split('-').map(Number);
        const selected = new Date(y, m - 1, d);
        if (!isSameDay(selected, now)) return -1;

        const currentH = now.getHours();
        const currentM = now.getMinutes();
        const [openH, openM] = todayHours.open.split(':').map(Number);

        const currentTotal = currentH * 60 + currentM;
        const openTotal = openH * 60 + openM;

        if (currentTotal < openTotal) return -1;
        return (currentTotal - openTotal) * PIXELS_PER_MINUTE;
    };

    const nowOffset = getNowOffset();

    // --- UNIFIED RENDER STRUCTURE ---
    return (
        <div className="card" style={{ overflowX: 'auto', padding: '0', border: 'none', boxShadow: 'var(--shadow-md)', width: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

            {/* HEADER (Always Visible) */}
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                left: 0,
                zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Timeline Availability</h2>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'var(--color-bg-page)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                        {selectedDate}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 16, height: 16, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 4 }}></div>
                        <span>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: 16, height: 16,
                            background: 'linear-gradient(135deg, var(--color-tpl-blue) 0%, var(--color-tpl-blue-dark) 100%)',
                            borderRadius: 4
                        }}></div>
                        <span>Booked</span>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div style={{ position: 'relative', minWidth: '100%', padding: '1rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* VISIBLE TIME AXIS - RENDERED ALWAYS to force width */}
                <div style={{ display: 'flex', paddingLeft: '180px', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    {timeSlots.length > 0 ? timeSlots.filter((_, i) => i % 12 === 0).map((time) => (
                        <div key={time} style={{ flex: 'none', width: `${60 * PIXELS_PER_MINUTE}px`, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            {time}
                        </div>
                    )) : (
                        /* Fallback width spacer if no timeslots (closed/invalid) - simulate 9am-9pm width */
                        Array.from({ length: 13 }).map((_, i) => (
                            <div key={i} style={{ flex: 'none', width: `${60 * PIXELS_PER_MINUTE}px`, fontSize: '0.75rem', fontWeight: 600, color: 'transparent' }}>00:00</div>
                        ))
                    )}
                </div>

                {/* INNER BODY */}
                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {branch.rooms.length === 0 ? (
                        /* NO ROOMS STATE (Centered in remaining space) */
                        <div style={{ position: 'sticky', left: 0, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--color-bg-page)', borderRadius: '50%' }}>
                                <AlertCircle size={48} color="var(--color-text-secondary)" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>No Study Rooms Available</h3>
                                <p style={{ marginTop: '0.5rem' }}>The <strong>{branch.name}</strong> branch does not currently offer bookable study rooms.</p>
                            </div>
                        </div>
                    ) : isClosed ? (
                        /* CLOSED STATE */
                        <div style={{ position: 'sticky', left: 0, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                            <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '50%' }}>
                                <CalendarX size={48} color="var(--color-danger)" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Branch Closed</h3>
                                <p style={{ marginTop: '0.5rem' }}>{branch.name} is closed on <strong>{selectedDate}</strong>.</p>
                            </div>
                        </div>
                    ) : (
                        /* ACTIVE GANTT ROWS */
                        <>
                            {/* NOW Indicator */}
                            {nowOffset >= 0 && (
                                <div style={{
                                    position: 'absolute',
                                    left: `calc(180px + ${nowOffset}px)`,
                                    top: 0, bottom: 0, width: '2px', background: 'var(--color-danger)',
                                    zIndex: 30, pointerEvents: 'none', boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                                }}>
                                    <div style={{ position: 'absolute', top: '-6px', left: '-5px', width: '12px', height: '12px', background: 'var(--color-danger)', borderRadius: '50%' }} />
                                    <div style={{ position: 'absolute', top: '-25px', left: '-20px', background: 'var(--color-danger)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>NOW</div>
                                </div>
                            )}

                            {/* Grid Lines */}
                            <div style={{ position: 'absolute', top: 0, left: '180px', width: '100%', height: '100%', pointerEvents: 'none' }}>
                                {timeSlots.filter((_, i) => i % 6 === 0).map((time, i) => (
                                    <div key={time} style={{
                                        position: 'absolute',
                                        left: `${(i * 30) * PIXELS_PER_MINUTE}px`,
                                        top: 0, bottom: 0,
                                        borderLeft: i % 2 === 0 ? '1px solid var(--color-border)' : '1px dashed #e2e8f0',
                                        opacity: 0.5
                                    }} />
                                ))}
                            </div>

                            {branch.rooms.map((room, index) => (
                                <div key={room.id} style={{
                                    display: 'flex', alignItems: 'center', height: '70px',
                                    borderBottom: '1px solid var(--color-border)',
                                    background: index % 2 === 0 ? 'white' : '#f8fafc',
                                    position: 'relative'
                                }}>
                                    <div className="room-label-container" style={{
                                        width: '180px', flex: 'none', padding: '0 1.5rem',
                                        borderRight: '2px solid var(--color-border)',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                        height: '100%', background: 'white', position: 'sticky', left: 0, zIndex: 2,
                                        boxShadow: '2px 0 5px rgba(0,0,0,0.02)', cursor: 'help'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{room.name}</span>
                                            <Info size={14} color="var(--color-text-secondary)" style={{ opacity: 0.5 }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginTop: '2px' }}>Capacity: {room.capacity}</span>
                                        {/* Room Tooltip */}
                                        <div className="room-tooltip" style={{
                                            position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
                                            background: '#1e293b', color: 'white', padding: '1rem', borderRadius: '8px',
                                            width: '220px', zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                                            marginLeft: '10px', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s', textAlign: 'left'
                                        }}>
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.25rem' }}>Room Details</h4>
                                            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={14} /> <span>Max: {room.capacity}</span></div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={14} /> <span>Screen</span></div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plug size={14} /> <span>Power</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                                        <div className="gantt-row" style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                            onClick={(e) => {
                                                if (!todayHours) return;
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const x = e.clientX - rect.left;
                                                const minutes = Math.floor(x / PIXELS_PER_MINUTE);
                                                const roundedMinutes = Math.floor(minutes / 5) * 5;
                                                const [openH, openM] = todayHours.open.split(':').map(Number);
                                                const totalMins = openH * 60 + openM + roundedMinutes;
                                                const hour = Math.floor(totalMins / 60);
                                                const min = totalMins % 60;
                                                onSlotClick(room.id, `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
                                            }} />
                                        {branchBookings.filter(b => b.roomId === room.id).map(booking => {
                                            const startOffset = getLeftOffset(booking.startTime);
                                            const endOffset = getLeftOffset(booking.endTime);
                                            const width = Math.max(endOffset - startOffset, 1);
                                            return (
                                                <div key={booking.id} onClick={(e) => { e.stopPropagation(); onBookingClick(booking.id); }}
                                                    style={{
                                                        position: 'absolute', left: `${startOffset}px`, width: `${width}px`, top: '12px', bottom: '12px',
                                                        background: 'linear-gradient(135deg, var(--color-tpl-blue) 0%, var(--color-tpl-blue-dark) 100%)',
                                                        color: 'white', borderRadius: '6px', padding: '0 12px', display: 'flex', alignItems: 'center',
                                                        fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                                                        zIndex: 10, pointerEvents: 'auto', cursor: 'pointer', transition: 'transform 0.1s'
                                                    }}
                                                    title={`Booked by ${booking.userId}`} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                                    {booking.userName}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .room-label-container:hover .room-tooltip { opacity: 1 !important; }
      `}</style>
        </div>
    );
}
