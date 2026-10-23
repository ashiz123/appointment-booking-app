import { createBookAppointmentWorkflow } from '../workflows/bookAppointment.workflow.js';
import { createRescheduleAppoinmentWorkflow } from '../workflows/rescheduleAppointment.workflow.js';
import { cancelAppointmentWorkflow } from '../workflows/cancelAppointment.workflow.js';
import { checkAvailabilityWorkflow } from '../workflows/checkAppointment.workflow.js';
import { findSlotByTimeWorkflow } from '../workflows/findSlotByTime.workflow.js';
import { createAppointmentToolDispatcher } from '../tools/executeTool.js';

export function createAppointmentTools({ slotRepo, bookService }) {
  //dependency Injection
  const bookAppointmentWF = createBookAppointmentWorkflow({
    slotRepo,
    bookService,
  });

  const rescheduleAppointmentWF = createRescheduleAppoinmentWorkflow({
    slotRepo,
    bookService,
  });

  const cancelWF = cancelAppointmentWorkflow({ bookService });

  const availabilityWF = checkAvailabilityWorkflow({ slotRepo });

  const findByTimeWF = findSlotByTimeWorkflow({ slotRepo });

  return createAppointmentToolDispatcher({
    bookAppointmentWF,
    rescheduleAppointmentWF,
    cancelWF,
    availabilityWF,
    findByTimeWF,
  });
}
