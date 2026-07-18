import { Router } from 'express';
import { eventsController } from './events.controller';

const router = Router();

// Event core
router.post('/', eventsController.createEvent.bind(eventsController));
router.get('/discover', eventsController.discoverEvents.bind(eventsController));
router.get('/:id', eventsController.getEvent.bind(eventsController));
router.patch('/:id/status', eventsController.updateEventStatus.bind(eventsController));

// Embedded items
router.post('/:id/schedules', eventsController.addScheduleItem.bind(eventsController));
router.post('/:id/announcements', eventsController.addAnnouncement.bind(eventsController));

// Attendance
router.post('/:id/register', eventsController.register.bind(eventsController));
router.post('/:id/cancel', eventsController.cancelRegistration.bind(eventsController));

// Check-in
router.post('/:id/checkin', eventsController.processCheckIn.bind(eventsController));

// Approvals (Volunteer Hours)
router.post('/:id/approve', eventsController.approveHours.bind(eventsController));

export const eventsRouter: Router = router;
