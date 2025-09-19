

export async function slotIndex(db) {
 const slotCollection = db.collection('appointment_slots');
 await slotCollection.createIndex({slot_start : 1});
 console.log('Indexes created for appointment slots successfully');
}

export async function creatingBookingSlotIndex(db){
    const bookingCollection = db.collection('booking_slot');
    await bookingCollection.createIndex({appointment_slot_id : 1, email : 1}, {unique: true});
    await bookingCollection.createIndex({appointment_slot_id : 1});
    console.log('booking slot index created successfully');
}