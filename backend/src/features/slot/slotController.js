import { slotService } from './slotService.js';
import {
  minutesToDate,
  timeToMinute,
} from '../../shared/utils/dateTimeCovert.js';
import { getLogger } from '../../shared/utils/logger.js';

export async function createSlot(req, res, next) {
  //validation - express-validator in route
  const {
    business_id,
    service_id,
    business_start,
    business_end,
    service_duration,
    date,
    seats,
  } = req.body;
  const authId = req.user.id;
  const slots = [];
  const start = timeToMinute(business_start);
  const end = timeToMinute(business_end);
  const serviceDuration = service_duration;

  for (
    let current = start;
    current + serviceDuration <= end;
    current += serviceDuration
  ) {
    const service = await slotService();
    const slotStart = minutesToDate(date, current);
    const slotEndMinute = current + serviceDuration;
    const slotEnd = minutesToDate(date, slotEndMinute);

    try {
      const generateSlot = await service.createSlot(
        authId,
        slotStart,
        slotEnd,
        business_id,
        service_id,
        seats
      );
      slots.push({
        slotStart,
        slotEnd,
        success: generateSlot.success,
        error: generateSlot.success ? null : 'Slot not created',
      });
    } catch (err) {
      return next(err);
    }
  }

  return res.status(200).json({
    slots,
  });
}

export async function getSlotsByDate(req, res, next) {
  try {
    const date = req.query.date;

    if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
      return res
        .status(400)
        .json({ error: 'A valid date query parameter is required.' });
    }

    const filterDay = new Date(date);
    filterDay.setHours(0, 0, 0, 0);

    const tomorrow = new Date(filterDay);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const service = await slotService();
    const data = await service.showSlotByDate(filterDay, tomorrow);

    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
}
