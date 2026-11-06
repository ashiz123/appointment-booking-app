export function validateFutureDate(date, time = null) {
  let targetDateTime;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  if (time) {
    targetDateTime = new Date(`${date}T${time}:00`);
  } else {
    targetDateTime = new Date(`${date}T00:00:00`);
  }

  if (isNaN(targetDateTime.getTime())) {
    throw new Error(`Invalid date or time format: ${date} ${time}`);
  }

  if (targetDateTime < today) {
    throw new Error(
      'Cannot process appointments for dates and times in the past.'
    );
  }
}
