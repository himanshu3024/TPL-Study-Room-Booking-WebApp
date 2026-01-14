"use client";

import { useState, useEffect } from "react";
import { useBookingStore, Booking } from "@/lib/store";
import { WeeklyHours } from "@/data/branches";
import { X, Printer, CheckCircle, Trash2, AlertCircle } from "lucide-react";
import { ReceiptPrinter } from "./ReceiptPrinter";
import { addMinutes, format, set } from "date-fns";
import { useToast } from "@/components/ui/ToastProvider";

type BookingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialRoomId: string;
    initialStartTime: string;
    existingBookingId?: string | null;
};

export function BookingModal({ isOpen, onClose, initialRoomId, initialStartTime, existingBookingId }: BookingModalProps) {
    const { selectedBranchId, getBranch, bookings, addBooking, cancelBooking, selectedDate } = useBookingStore();
    const { addToast } = useToast();

    const branch = getBranch(selectedBranchId);
    const room = branch?.rooms.find(r => r.id === initialRoomId);

    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [startTime, setStartTime] = useState(initialStartTime);
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState("");

    const [lastBooking, setLastBooking] = useState<Booking | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);

    // VIEW MODE: Existing Booking
    const existingBooking = existingBookingId ? bookings.find(b => b.id === existingBookingId) : null;

    // Time Slots Logic
    const availableSlots = React.useMemo(() => {
        if (!branch) return [];
        try {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const localDate = new Date(y, m - 1, d);
            const dayName = format(localDate, 'EEEE') as keyof WeeklyHours;
            const hours = branch.hours[dayName];
            if (!hours) return [];

            const [openH, openM] = hours.open.split(':').map(Number);
            const [closeH, closeM] = hours.close.split(':').map(Number);

            const slots = [];
            const baseDate = set(new Date(), { hours: openH, minutes: openM, seconds: 0 });
            const totalMins = (closeH * 60 + closeM) - (openH * 60 + openM);
            // Generate every 5 mins
            for (let i = 0; i <= totalMins / 5; i++) {
                slots.push(format(addMinutes(baseDate, i * 5), "HH:mm"));
            }
            return slots;
        } catch (e) { return [] }
    }, [branch, selectedDate]);

    useEffect(() => {
        if (isOpen) {
            if (existingBooking) {
                // Mode: View Details
                setUserName(existingBooking.userName);
                setUserId(existingBooking.userId);
                setStartTime(existingBooking.startTime);
                setEndTime(existingBooking.endTime);
                setShowReceipt(false);
            } else {
                // Mode: New Booking
                setStartTime(initialStartTime);
                const startIndex = availableSlots.indexOf(initialStartTime);
                if (startIndex !== -1 && startIndex + 12 < availableSlots.length) {
                    setEndTime(availableSlots[startIndex + 12]);
                } else if (startIndex !== -1 && startIndex + 1 < availableSlots.length) {
                    setEndTime(availableSlots[startIndex + 1]);
                } else {
                    setEndTime(initialStartTime);
                }
                setShowReceipt(false);
                setLastBooking(null);
                setError("");
                setUserName("");
                setUserId("");
            }
        }
    }, [isOpen, initialStartTime, selectedDate, existingBooking, availableSlots]);

    if (!isOpen || !branch || !room) return null;

    // --- HANDLERS ---

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // 1. Validation
        if (!userName || !userId) {
            setError("Please fill in all fields.");
            return;
        }
        if (startTime >= endTime) {
            setError("End time must be after start time.");
            return;
        }
        // Check duration (Max 2 hours)
        const sIdx = availableSlots.indexOf(startTime);
        const eIdx = availableSlots.indexOf(endTime);
        if ((eIdx - sIdx) * 5 > 120) {
            setError("Maximum booking duration is 2 hours.");
            return;
        }
        // Check overlap
        const hasOverlap = bookings.some(b =>
            b.branchId === selectedBranchId &&
            b.roomId === initialRoomId &&
            b.status === 'active' &&
            b.date === selectedDate &&
            (
                (startTime >= b.startTime && startTime < b.endTime) ||
                (endTime > b.startTime && endTime <= b.endTime) ||
                (startTime <= b.startTime && endTime >= b.endTime)
            )
        );
        if (hasOverlap) {
            setError("Selected time overlaps with an existing booking.");
            return;
        }

        // Check Daily Limit (1 booking per user per branch per day)
        const existingUserBooking = bookings.find(b =>
            b.branchId === selectedBranchId &&
            b.date === selectedDate &&
            b.userId === userId &&
            b.status === 'active'
        );
        if (existingUserBooking) {
            setError(`User ${userId} already has a booking at this branch today. Limit is 1 per day.`);
            return;
        }

        // 2. Add Booking
        const newBookingData = {
            branchId: selectedBranchId,
            roomId: initialRoomId,
            userId,
            userName,
            date: selectedDate,
            startTime,
            endTime,
        };
        addBooking(newBookingData);
        addToast(`Booking confirmed for ${userName}`, "success");

        // 3. Show Success
        const tempBooking = { ...newBookingData, id: "temp", status: "active" as const, createdAt: new Date().toISOString() };
        setLastBooking(tempBooking);
        setShowReceipt(true);
    };

    const handleDelete = () => {
        if (existingBookingId) {
            cancelBooking(existingBookingId);
            addToast("Booking deleted", "info"); // Currently simple delete, undo requires more complex store logic
            onClose();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- RENDER: RECEIPT VIEW (New Booking Confirmation) ---
    if (showReceipt && lastBooking) {
        return (
            <div style={overlayStyle}>
                <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ background: '#f0fdf4', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <CheckCircle size={48} color="var(--color-success)" />
                        </div>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Booking Confirmed!</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>{selectedDate}<br /><strong>{userName}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn" onClick={handlePrint}>
                            <Printer size={18} style={{ marginRight: '0.5rem' }} /> Print Receipt
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>Done</button>
                    </div>
                    <ReceiptPrinter booking={lastBooking} branch={branch} room={room} />
                </div>
            </div>
        );
    }

    // --- RENDER: EXISTING BOOKING DETAILS ---
    if (existingBooking) {
        return (
            <div style={overlayStyle}>
                <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Booking Details</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="var(--color-text-secondary)" />
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-tpl-blue)' }}>
                                    {existingBooking.userName.charAt(0)}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{existingBooking.userName}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Card: {existingBooking.userId}</p>
                                </div>
                            </div>
                            <hr style={{ margin: '0 0 1rem 0', borderColor: '#e2e8f0' }} />
                            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <p><strong>Branch:</strong> {branch.name}</p>
                                <p><strong>Room:</strong> {room.name}</p>
                                <p><strong>Time:</strong> {existingBooking.startTime} - {existingBooking.endTime}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn btn-danger" onClick={handleDelete} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', boxShadow: 'none' }}>
                            <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Delete Booking
                        </button>

                        <button className="btn" onClick={handlePrint}>
                            <Printer size={18} style={{ marginRight: '0.5rem' }} /> Print Receipt
                        </button>
                    </div>

                    {/* Hidden Receipt for Printing */}
                    <ReceiptPrinter booking={existingBooking} branch={branch} room={room} />
                </div>
            </div>
        );
    }

    // --- RENDER: NEW BOOKING FORM ---
    return (
        <div style={overlayStyle}>
            <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>New Booking</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="var(--color-text-secondary)" />
                    </button>
                </div>

                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <strong>{branch.name}</strong> • {room.name} <br />
                    <span style={{ color: '#64748b' }}>{selectedDate}</span>
                </div>

                <form onSubmit={handleBook}>
                    {error && (
                        <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyle}>User ID (Card #)</label>
                            <input style={inputStyle} value={userId} onChange={e => setUserId(e.target.value)} placeholder="2345..." required />
                        </div>
                        <div>
                            <label style={labelStyle}>User Name</label>
                            <input style={inputStyle} value={userName} onChange={e => setUserName(e.target.value)} placeholder="John Doe" required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={labelStyle}>Start Time</label>
                            <select style={inputStyle} value={startTime} onChange={e => setStartTime(e.target.value)}>
                                {availableSlots.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>End Time</label>
                            <select style={inputStyle} value={endTime} onChange={e => setEndTime(e.target.value)}>
                                {availableSlots.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(4px)'
};

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.875rem', fontWeight: 600,
    marginBottom: '0.25rem', color: 'var(--color-text-secondary)'
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem', borderRadius: '6px',
    border: '1px solid var(--color-border)', fontSize: '1rem'
};

import React from "react";
