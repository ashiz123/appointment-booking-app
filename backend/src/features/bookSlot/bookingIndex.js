


export async function bookingIndex(db){
    const bookingCollection = db.collection('booking_slot');
    await bookingCollection.createIndex(
  { appointment_slot_id: 1, email: 1 },
  { 
    unique: true,
    partialFilterExpression: {status: { $in: ['booked', 'completed', 'rescheduled'] } }
  }
);
    console.log('booking slot index created successfully with unique email and not cancelled');
}