import { Booking } from "@/lib/store";
import { format } from "date-fns";
import { BranchData, RoomData } from "@/data/branches";

type ReceiptPrinterProps = {
    booking: Booking;
    branch: BranchData;
    room: RoomData;
};

export const ReceiptPrinter = ({ booking, branch, room }: ReceiptPrinterProps) => {
    return (
        <div className="receipt-container" style={{ display: 'none' }}>
            <div style={{
                width: '300px',
                fontFamily: 'monospace',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid #000'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '1rem', borderBottom: '1px dashed black', paddingBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Toronto Public Library</h2>
                    <p style={{ margin: '5px 0' }}>Study Room Booking</p>
                </div>

                {/* Details */}
                <div style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <p><strong>Branch:</strong><br />{branch.name}</p>
                    <p><strong>Room:</strong> {room.name}</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                    <br />
                    <p><strong>User:</strong> {booking.userName}</p>
                    <p><strong>Card:</strong> *******{booking.userId.slice(-4)}</p>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px dashed black', paddingTop: '1rem' }}>
                    <p style={{ fontWeight: 'bold' }}>Thank you for visiting TPL!</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Please clear the room by {booking.endTime}.
                    </p>
                    <p style={{ fontSize: '0.7rem', marginTop: '1rem' }}>
                        {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
                    </p>
                </div>
            </div>
        </div>
    );
};
