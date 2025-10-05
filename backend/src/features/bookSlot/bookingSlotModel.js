
import { v4 as uuidv4 } from "uuid";

export function buildBooking(slot_id, fullname, email, phone, status, rescheduled_count=0)
{

return {
            appointment_slot_id : slot_id,
            fullname ,
            email,
            phone ,
            status,
            booking_reference: uuidv4(),
            rescheduled_count,
            created_at : new Date(),
            updated_at : new Date()
            }

}