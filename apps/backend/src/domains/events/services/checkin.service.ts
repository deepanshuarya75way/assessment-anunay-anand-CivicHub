import { AttendanceModel, IAttendanceDocument } from '../models/attendance.model';
import { eventsService } from './events.service';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { ValidationError, NotFoundError } from '../../../core/exceptions';

export interface CheckInContext {
  eventId: string;
  userId: string;
  timestamp: Date;
  organizerId?: string;
  deviceInfo?: string;
}

export interface CheckInResult {
  success: boolean;
  attendanceRecord?: IAttendanceDocument;
  error?: string;
}

export interface ICheckInProvider {
  verify(data: any, context: CheckInContext): Promise<boolean>;
  getProviderName(): string;
}

export class CheckInService {
  private providers: Map<string, ICheckInProvider> = new Map();

  registerProvider(provider: ICheckInProvider) {
    this.providers.set(provider.getProviderName(), provider);
  }

  async processCheckIn(providerName: string, data: any, context: CheckInContext): Promise<CheckInResult> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      return { success: false, error: `Provider ${providerName} not supported` };
    }

    const event = await eventsService.getEvent(context.eventId);
    if (event.status !== 'LIVE' && event.status !== 'REGISTRATION_CLOSED') {
       return { success: false, error: 'Event is not active for check-in' };
    }

    const isValid = await provider.verify(data, context);
    if (!isValid) {
      return { success: false, error: 'Check-in verification failed' };
    }

    const attendance = await AttendanceModel.findOne({ eventId: context.eventId, userId: context.userId });
    if (!attendance) {
      return { success: false, error: 'Registration not found for user' };
    }

    attendance.status = 'CHECKED_IN';
    attendance.checkInTime = context.timestamp;
    attendance.checkedInBy = context.organizerId;
    attendance.checkInMethod = provider.getProviderName();
    attendance.deviceInfo = context.deviceInfo;

    await attendance.save();

    EventBus.publish(EventTopic.EVENT_ATTENDEE_CHECKED_IN, {
      eventId: context.eventId,
      userId: context.userId,
      timestamp: context.timestamp,
      method: providerName
    });

    return { success: true, attendanceRecord: attendance };
  }
}

export const checkInService = new CheckInService();

// Built-in Providers
export class ManualCheckInProvider implements ICheckInProvider {
  getProviderName() { return 'MANUAL'; }
  async verify(data: any, context: CheckInContext) {
    // Requires an organizer ID to perform manual check-in
    return !!context.organizerId;
  }
}

export class QRCheckInProvider implements ICheckInProvider {
  getProviderName() { return 'QR'; }
  async verify(data: { qrToken: string }, context: CheckInContext): Promise<boolean> {
    // Validate QR token logic here
    // In a real implementation, we'd verify a signed JWT or similar token
    return Boolean(data && data.qrToken && data.qrToken.length > 10);
  }
}

// Register built-in providers
checkInService.registerProvider(new ManualCheckInProvider());
checkInService.registerProvider(new QRCheckInProvider());
