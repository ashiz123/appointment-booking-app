export function hasUserDetails(args) {
  const fullname = String(args.fullname ?? '')
    .trim()
    .toLowerCase();
  const email = String(args.email ?? '')
    .trim()
    .toLowerCase();
  const bookingDate = String(args.date ?? '').trim();
  const startTime = String(args.start_time ?? '').trim();
  const phone = String(args.phone ?? '')
    .trim()
    .toLowerCase();

  const errors = [];

  if (!fullname) {
    errors.push('Fullname is required');
  }

  if (['user', 'test'].includes(fullname)) {
    errors.push('Fullname cannot be random');
  }

  if (!email) {
    errors.push('Email is required');
  }

  if (email.includes('@example.com')) {
    errors.push('Email cannot be random');
  }

  if (!bookingDate) {
    errors.push('Booking date is required');
  }

  if (!startTime) {
    errors.push('Booking time is required');
  }

  if (!phone) {
    errors.push('Phone number is required');
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    fullname: args.fullname.trim(),
    email: args.email.trim(),
  };
}
