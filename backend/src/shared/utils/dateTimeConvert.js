export const now = new Date();

export function timeToMinute(time) {
  const [hours, minute] = time.split(':').map(Number);
  return hours * 60 + minute;
}

export function minuteToTime(minute) {
  const hrs = Math.floor(minute / 60);
  const mins = minute % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function hhmmToDate(date, time) {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(
    `${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`
  );
}

export function minutesToDate(date, minutes) {
  //type of date is converted from string to date object by validation function.
  return new Date(date.getTime() + minutes * 60000);
}

// export const todayStr = new Intl.DateTimeFormat('en-CA', {
//   timeZone: 'Europe/London',
//   year: 'numeric',
//   month: '2-digit',
//   day: '2-digit',
// }).format(now);

// export const currentTimeStr = new Intl.DateTimeFormat('en-GB', {
//   timeZone: 'Europe/London',
//   hour: '2-digit',
//   minute: '2-digit',
//   hourCycle: 'h23',
// }).format(now);

export const todayStr = new Date().toISOString().split('T')[0];
export const currentTimeStr = new Date().toTimeString().slice(0, 5);
