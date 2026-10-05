import { getSlotsByDatePipeline } from './pipelines/slotPipeline.js';
import { AppError } from '../../shared/utils/appError.js';
import { ObjectId } from 'mongodb';

export class SlotRepository {
  constructor(db) {
    this.db = db;
    this.collectionName = 'appointment_slots';
  }

  async createSlot(slot_start, slot_end, businessId, serviceId, seats) {
    if (!slot_start || !slot_end)
      throw new AppError('validationError', [
        { msg: 'Slot start and end required' },
      ]);
    if (!seats || seats < 1)
      throw new AppError('validationError', [
        { msg: 'Seats is required and must me atleast 1' },
      ]);

    const slotDoc = {
      business_id: new ObjectId(String(businessId)),
      service_id: new ObjectId(String(serviceId)),
      slot_start: new Date(slot_start),
      slot_end: new Date(slot_end),
      status: 'available',
      booked: 0,
      total_seats: seats,
    };

    const result = await this.db
      .collection(this.collectionName)
      .insertOne(slotDoc);
    return result;
  }

  async fetchSeatsBySlotId(slot_id) {
    const slot = await this.db
      .collection(this.collectionName)
      .findOne({ _id: slot_id });
    return slot;
  }

  async bookingSeat(slot_id) {
    const slot = await this.db
      .collection('appointment_slots')
      .findOne({ _id: slot_id });
    if (!slot)
      throw new AppError('resourceNotFound', [{ msg: 'Slot not found' }]);

    if (slot.total_seats - slot.booked === 0) {
      throw new AppError('slotBookingExceeded', [
        { msg: 'Slot booking trying to exceed total seats' },
      ]);
    }

    const result = await this.db
      .collection(this.collectionName)
      .updateOne(
        { _id: slot_id, booked: { $lt: slot.total_seats } },
        { $inc: { booked: 1 }, $set: { updated_at: new Date() } }
      );

    return result;
  }

  async unbookingSeat(slotId) {
    const result = await this.db
      .collection(this.collectionName)
      .updateOne(
        { _id: slotId, booked: { $gt: 0 } },
        { $set: { updated_at: new Date() }, $inc: { booked: -1 } }
      );

    if (result.matchedCount === 0 || result.modifiedCount === 0) {
      throw new AppError('failedToUnbook', [{ msg: 'Failed to unbook seat' }]);
    }

    return result;
  }

  async showSlotByDate(day, nextDay) {
    if (!day)
      throw new AppError('validationError', [{ msg: 'Date is required' }]);
    const pipeline = await getSlotsByDatePipeline(day, nextDay);
    const results = await this.db
      .collection(this.collectionName)
      .aggregate(pipeline)
      .toArray();
    return results;
  }

  async showSlotsByDay(dateString) {
    console.log(dateString);
    // Example: dateString is "2026-10-05"
    const startOfDay = new Date();
    const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

    const slots = await this.db
      .collection(this.collectionName)
      .find({
        slot_start: { $gte: startOfDay, $lte: endOfDay },
        booked: 0, // or whatever logic you use for available seats
      })
      .toArray();

    return slots;
  }

  async findSlotByStartTime(date, start_time) {
    const targetStartTime = new Date(`${date}T${start_time}:00.000Z`);

    const slot = await this.db.collection(this.collectionName).findOne({
      slot_start: targetStartTime,
      booked: 0,
    });

    return slot;
  }

  //Valid date is greater than current date
  async isDateValid(slot_id) {
    const result = await this.db
      .collection(this.collectionName)
      .findOne({ _id: slot_id });
    if (!result)
      throw new AppError('resourceNotFound', [{ msg: 'No document found' }]);
    if (!(result.slot_start instanceof Date))
      throw new AppError('validationError', [
        { msg: 'Invalid slot_start value' },
      ]);
    return result.slot_start > new Date();
  }

  //available slots for day
  //when did i have my booking/appointment(do in booking repository)
  //When is next available slots?
  //Is there any slot available for --- day?
}
