

export async function slotIndex(db) {
    const slotCollection = db.collection('appointment_slots');
    await slotCollection.createIndex({slot_start : 1});
    console.log('Indexes created for appointment slots by slot_start successfully');

    await slotCollection.createIndex({service_id: 1, slot_start:1}, {unique:true});
    console.log('Index for unique service with slot start created successfully');
}






