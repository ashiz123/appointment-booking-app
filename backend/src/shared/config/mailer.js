
import nodemailer from "nodemailer";

//configure a transporter
// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7536e1a188d862",
    pass: "c4413c1d2cfef9"
  }
});




//compose a message
//Add the reschedule and Cancle link .

export async function sendAppointmentEmail(to, name, dateTime, booking_reference) {
  try {
    await transporter.sendMail({
      from: '"Appointments" <appointments@myapp.com>',
      to: to, //receipents
      subject: "Your Appointment is Scheduled",
      text: `Hello ${name},\nYour appointment is scheduled for ${dateTime} \n  Thank you!`,
      html: `<p>Hello <b>${name}</b>,</p>
             <p>Your appointment is scheduled for <b>${dateTime}</b>.</p>
             <p>Booking reference : <b>${booking_reference} </b> </p>
             <p>Thank you!</p>`
    });
    console.log("Email sent successfully to Mailtrap sandbox!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}