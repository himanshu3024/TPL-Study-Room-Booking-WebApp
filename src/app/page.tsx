"use client";

import { useState } from "react";
import { AvailabilityGantt } from "@/components/AvailabilityGantt";
import { BranchSelector } from "@/components/BranchSelector";
import { BookingModal } from "@/components/BookingModal";
import { useBookingStore } from "@/lib/store";

export default function Home() {
  const { bookings } = useBookingStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleSlotClick = (roomId: string, time: string) => {
    setSelectedRoom(roomId);
    setSelectedTime(time);
    setSelectedBookingId(null); // New Booking Mode
    setIsModalOpen(true);
  };

  const handleBookingClick = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedRoom(booking.roomId);
      setSelectedTime(booking.startTime); // Not strictly needed for display but keeps state consistent
      setSelectedBookingId(bookingId); // View Details Mode
      setIsModalOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '80vh', width: '100%' }}>
      <BranchSelector />

      <div style={{ marginBottom: '2rem' }}>
        <AvailabilityGantt
          onSlotClick={handleSlotClick}
          onBookingClick={handleBookingClick}
        />
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRoomId={selectedRoom}
        initialStartTime={selectedTime}
        existingBookingId={selectedBookingId}
      />
    </div>
  );
}
