

import { ObjectId } from "mongodb";
import { buildBooking } from "./bookingSlotModel.js";
import {sendAppointmentEmail, sendAppointmentCancelEmail } from "../../shared/config/mailer.js"; 




export function bookSlotFactory(bookRepo, slotRepo){

    return {


            async bookSlot({appointment_slot_id, fullname, email, phone, status}){
          
             let result;
             let bookedSeat;
             const slot_id = new ObjectId(appointment_slot_id);
             const isValidDateToBook = await slotRepo.isDateValid(slot_id);     //check the valid date to book. Is it greater than current date and time


            if(!isValidDateToBook){
                return {success: false, status: 400, message: "Date must be greater than current date and time"};
            }

         try{

               bookedSeat = await slotRepo.bookingSeat(slot_id); 
               
               if(bookedSeat.acknowledged && bookedSeat.modifiedCount > 0){
                  const bookingResult = await bookRepo.bookingSlot(
                       buildBooking(slot_id, fullname, email, phone, status)
                 );
                 
                 await sendAppointmentEmail(email, fullname, bookingResult.slot_start, bookingResult.booking_reference);
                 result = {success:true, status:200, message : "Slot booked successfully"};
               }else{
                  throw new Error("Issue with the appointment slot booking");
               }

                return result;
            }
             catch(err){
               if(bookedSeat.acknowledged && bookedSeat.modifiedCount > 0){
                    const canceled = await slotRepo.unbookingSeat(slot_id);
                    if(canceled.modifiedCount === 1 ){
                     console.log("Unbook the appointment slot collection, Rolling back");
                    }
                }

                return {success: false, status:409, message : err.message}
             }
            },




                   
                
         
            async rescheduleAppointment(booking_reference, appointment_slot_id){

             const slot_id = new ObjectId(appointment_slot_id);
             const isValidDateToBook = await slotRepo.isDateValid(slot_id);     //check the valid date to book. Is it greater than current date and time


            if(!isValidDateToBook){
                return {success: false, status: 400, message: "Date must be greater than current date and time"};
            }

             try{
                const previousBooking = await bookRepo.fetchBookingDetail(booking_reference);

                await slotRepo.unbookingSeat(previousBooking.appointment_slot_id);
                console.log('unbooked previous slot');

                await slotRepo.bookingSeat(slot_id);
                console.log('booking another appointment slot successful');

                const reschedule = await bookRepo.rescheduleBooking(booking_reference, slot_id);
                
                 if(!reschedule){
                    await slotRepo.unbookingSeat(slot_id);
                    await slotRepo.bookingSeat(previousBooking.appointment_slot_id);
                    throw new Error("Booking could not be created");
                 }

                const text = "Your appointment is rescheduled ";
                await sendAppointmentEmail(reschedule.email, reschedule.fullname, reschedule.slot_start, reschedule.booking_reference, text);
                return {success: true, status : 200, message : "Rescheduled successfully done"}
             }
             catch(err){
                return {success: false, status:409, message : err.message} 
             }

            }, 







        async cancelAppointment(email, booking_reference){
         try{
            if(!email){
               throw new Error("Email is required");
            }

            const cancelAppointment = await bookRepo.cancleBookedSlot(email, booking_reference);
            console.log(cancelAppointment);


            if(cancelAppointment.matchedCount === 0 || cancelAppointment.modifiedCount === 0){
               throw new Error("Appointment not found to cancel or already cancelled")
            }

            const text = "Your appointment is cancelled ";
            await sendAppointmentCancelEmail(email, booking_reference, text, new Date());
            return {success: true, status : 200, message : "Appointment successfully cancelled"}
         }
         catch(err){
            return {success: false, status:409, message : err.message} 
         }

        },


        async getBookedAppointment(fromDate, toDate, authId){
         try{  
            if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
               console.log('here it is')
               throw new Error('From and To date are required and must be valid dates');
            }

         const bookedAppointment = await bookRepo.fetchBookingByDate(fromDate, toDate, authId);
         return {success: true, status : 200, data:bookedAppointment}
         }
         catch(err){
            return {success: false, status:409, message : err.message} 
         }
         
        }

    }


}




