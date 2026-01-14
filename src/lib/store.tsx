"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BRANCH_DATA, BranchData } from "@/data/branches";

// Booking Type Update
export type Booking = {
  id: string;
  branchId: string;
  roomId: string;
  userId: string;
  userName: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  status: "active" | "cancelled" | "completed";
  createdAt: string;
};

type BookingContextType = {
  branches: BranchData[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => void;
  cancelBooking: (id: string) => void;
  getBranch: (id: string) => BranchData | undefined;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(BRANCH_DATA[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount (persistence)
  useEffect(() => {
    const stored = localStorage.getItem("tpl-bookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tpl-bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (newBooking: Omit<Booking, "id" | "createdAt" | "status">) => {
    const booking: Booking = {
      ...newBooking,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "active",
    };
    setBookings((prev) => [...prev, booking]);
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  const getBranch = (id: string) => BRANCH_DATA.find((b) => b.id === id);

  return (
    <BookingContext.Provider
      value={{
        branches: BRANCH_DATA,
        selectedBranchId,
        setSelectedBranchId,
        selectedDate,
        setSelectedDate,
        bookings,
        addBooking,
        cancelBooking,
        getBranch,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingStore() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingStore must be used within a BookingProvider");
  }
  return context;
}
