import { v4 as uuidv4 } from 'uuid';

export function buildBooking(
  slot_id,
  date,
  start_time,
  fullname,
  email,
  phone,
  status,
  rescheduled_count = 0
) {
  console.log('slot id', slot_id);
  return {
    appointment_slot_id: slot_id,
    fullname,
    email,
    phone,
    status,
    booking_reference: uuidv4(),
    rescheduled_count,
    request_date: date,
    request_time: start_time,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
