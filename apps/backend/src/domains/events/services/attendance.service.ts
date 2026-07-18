import { AttendanceModel, IAttendanceDocument } from '../models/attendance.model';
import { eventsService } from './events.service';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { ValidationError, NotFoundError } from '../../../core/exceptions';
import { AttendanceStatus } from '@civichub/shared';

export class AttendanceService {
  /**
   * Register a user for an event
   */
  async register(eventId: string, userId: string): Promise<IAttendanceDocument> {
    const event = await eventsService.getEvent(eventId);
    
    if (event.status !== 'REGISTRATION_OPEN') {
      throw new ValidationError('Registration is not open for this event');
    }

    // Check capacity
    const currentRegistrations = await AttendanceModel.countDocuments({
      eventId,
      status: { $in: ['REGISTERED', 'CHECKED_IN', 'ATTENDED', 'COMPLETED'] }
    });

    const limit = event.registrationLimit || event.capacity;
    let status: AttendanceStatus = 'REGISTERED';
    
    if (limit && currentRegistrations >= limit) {
      status = 'WAITLISTED';
    }

    try {
      const attendance = new AttendanceModel({
        eventId,
        userId,
        status,
      });
      await attendance.save();

      EventBus.publish(EventTopic.EVENT_REGISTRATION_CREATED, { eventId, userId, status });
      return attendance;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ValidationError('User is already registered for this event');
      }
      throw error;
    }
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(eventId: string, userId: string): Promise<IAttendanceDocument> {
    const attendance = await AttendanceModel.findOne({ eventId, userId });
    if (!attendance) throw new NotFoundError('Registration not found');

    attendance.status = 'CANCELLED';
    await attendance.save();

    EventBus.publish(EventTopic.EVENT_REGISTRATION_CANCELLED, { eventId, userId });
    
    // Logic to move waitlisted users to registered could go here or in an event listener

    return attendance;
  }

  /**
   * Approve volunteer hours for an attendee
   */
  async approveHours(eventId: string, userId: string, hours: number, approverId: string): Promise<IAttendanceDocument> {
    const attendance = await AttendanceModel.findOne({ eventId, userId });
    if (!attendance) throw new NotFoundError('Attendance record not found');
    
    const event = await eventsService.getEvent(eventId);
    if (event.organizerId !== approverId) throw new ValidationError('Only organizer can approve hours');
    
    attendance.hoursEarned = hours;
    attendance.completion = {
      approvedBy: approverId,
      approvedAt: new Date(),
      eligibleForCertificate: true
    };
    attendance.status = 'COMPLETED';

    await attendance.save();

    // Publish event to notify Volunteer domain's hour ledger
    EventBus.publish(EventTopic.VOLUNTEER_HOUR_RECORDED, {
      userId,
      eventId,
      hours,
      approvedBy: approverId
    });

    return attendance;
  }
}

export const attendanceService = new AttendanceService();
