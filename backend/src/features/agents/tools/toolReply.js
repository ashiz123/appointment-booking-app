//Tool reply is used to eliminate the second time LLM call

export function createToolReply(name, result) {
  switch (name) {
    case 'book_appointment': {
      console.log('result', result);

      if (result?.errors?.length > 0) {
        return result.errors.join(', ');
      }
      return result?.message;
    }

    case 'reschedule_appointment':
      return 'Appointment scheduled successfully';

    case 'cancel_appointment':
      console.log('result', result);
      return 'Appointment cancelled successfully';

    case 'find_slot_by_time': {
      console.log('result', result);

      const space =
        result?.data?.data?.total_seats - result?.data?.data?.booked;
      if (space < 0 || space === undefined) {
        return 'No available slot in your requested time';
      }
      return `We have ${space} seats available.`;
    }

    case 'check_appointment_available': {
      console.log('result in reply', result);
      const slots = result?.data ?? result;

      if (!Array.isArray(slots) || slots.length === 0) {
        return 'There are no available appointments for that date.';
      }

      const times = slots.map((slot) => {
        const start = new Date(slot.slot_start);

        return new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(start);
      });

      return `Available appointment times: ${times.join(', ')}. Which time would you like?`;
    }

    case 'collecting_detail': {
      console.log('result data', result.errors);
      const formattedString = result.join(', ');
      return formattedString;
    }

    default:
      return 'The appointment request was completed';
  }
}
