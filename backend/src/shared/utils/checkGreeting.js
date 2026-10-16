export function checkGreeting(text) {
  //return boolean
  if (typeof text !== 'string') return false;
  //normalizing the data first
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[!.,?]+$/g, '');
  return /^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(
    normalized
  );
}
