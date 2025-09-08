export function timeToMinute(time){
    const [hours, minute] = time.split(":").map(Number);
    return hours * 60 + minute;
}

export function minuteToTime(minute){
    const hrs = Math.floor(minute/60);
    const mins = minute % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function hhmmToDate(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(`${date}T${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:00Z`);
}

export function minutesToDate(date, minutes) {
  //type of date is converted from string to date object by validation function.
  return new Date(date.getTime() + minutes * 60000);
}