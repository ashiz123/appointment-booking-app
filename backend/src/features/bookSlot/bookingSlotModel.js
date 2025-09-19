

export function buildBooking(slot_id, fullname, email, phone)
{

return {
            appointment_slot_id : slot_id,
            fullname ,
            email,
            phone ,
            created_at : new Date(),
            updated_at : new Date()
            }

}