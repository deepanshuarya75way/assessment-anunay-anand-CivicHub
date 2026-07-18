import { EventModel, IEventDocument } from '../models/event.model';
import { Event, EventStatus, ScheduleItem, Announcement } from '@civichub/shared';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { NotFoundError, ValidationError } from '../../../core/exceptions';
import { v4 as uuidv4 } from 'uuid';

export class EventsService {
  /**
   * Create a new event
   */
  async createEvent(data: Partial<Event>, organizerId: string): Promise<IEventDocument> {
    const event = new EventModel({
      ...data,
      organizerId,
      status: 'DRAFT',
    });

    await event.save();
    EventBus.publish(EventTopic.EVENT_CREATED, { eventId: event.id, organizerId });
    return event;
  }

  /**
   * Get event by ID
   */
  async getEvent(id: string): Promise<IEventDocument> {
    const event = await EventModel.findById(id);
    if (!event) throw new NotFoundError('Event not found');
    return event;
  }

  /**
   * Update event status
   */
  async updateEventStatus(id: string, status: EventStatus, organizerId: string): Promise<IEventDocument> {
    const event = await this.getEvent(id);
    
    if (event.organizerId !== organizerId) {
      throw new ValidationError('Only organizer can update status');
    }

    event.status = status;
    await event.save();
    
    // Publish specific status events
    switch(status) {
      case 'PUBLISHED':
        EventBus.publish(EventTopic.EVENT_PUBLISHED, { eventId: event.id });
        break;
      case 'REGISTRATION_OPEN':
        EventBus.publish(EventTopic.EVENT_REGISTRATION_OPENED, { eventId: event.id });
        break;
      case 'REGISTRATION_CLOSED':
        EventBus.publish(EventTopic.EVENT_REGISTRATION_CLOSED, { eventId: event.id });
        break;
      case 'LIVE':
        EventBus.publish(EventTopic.EVENT_LIVE, { eventId: event.id });
        break;
      case 'COMPLETED':
        EventBus.publish(EventTopic.EVENT_COMPLETED, { eventId: event.id });
        break;
      case 'CANCELLED':
        EventBus.publish(EventTopic.EVENT_CANCELLED, { eventId: event.id });
        break;
    }
    
    EventBus.publish(EventTopic.EVENT_UPDATED, { eventId: event.id, status });
    return event;
  }

  /**
   * Add a schedule item to the event
   */
  async addScheduleItem(eventId: string, scheduleItem: Omit<ScheduleItem, 'id'>, organizerId: string): Promise<IEventDocument> {
    const event = await this.getEvent(eventId);
    if (event.organizerId !== organizerId) throw new ValidationError('Only organizer can modify schedule');
    
    const newScheduleItem = { ...scheduleItem, id: uuidv4() } as ScheduleItem;
    event.schedules.push(newScheduleItem);
    await event.save();
    
    EventBus.publish(EventTopic.EVENT_SCHEDULE_UPDATED, { eventId: event.id, scheduleId: newScheduleItem.id });
    return event;
  }

  /**
   * Post an announcement to the event
   */
  async addAnnouncement(eventId: string, announcement: Omit<Announcement, 'id' | 'postedAt' | 'postedBy'>, organizerId: string): Promise<IEventDocument> {
    const event = await this.getEvent(eventId);
    if (event.organizerId !== organizerId) throw new ValidationError('Only organizer can announce');
    
    const newAnnouncement = {
      ...announcement,
      id: uuidv4(),
      postedBy: organizerId,
      postedAt: new Date()
    } as Announcement;
    
    event.announcements.push(newAnnouncement);
    await event.save();
    
    EventBus.publish(EventTopic.EVENT_ANNOUNCEMENT_CREATED, { 
      eventId: event.id, 
      announcementId: newAnnouncement.id, 
      priority: newAnnouncement.priority 
    });
    return event;
  }

  /**
   * Discover events based on composite ranking criteria
   */
  async discoverEvents(filters: any, lat?: number, lng?: number, maxDistance?: number): Promise<IEventDocument[]> {
    const query: any = {
      status: { $in: ['PUBLISHED', 'REGISTRATION_OPEN', 'LIVE'] },
      visibility: 'PUBLIC'
    };

    if (filters.spaceType && filters.spaceId) {
      query['space.type'] = filters.spaceType;
      query['space.id'] = filters.spaceId;
    }

    if (lat && lng && maxDistance) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: maxDistance
        }
      };
    }

    // A real composite ranking would consider attendance history, community engagement, etc.
    // Here we'll start with proximity (if provided by $near) and startTime.
    return EventModel.find(query).sort({ startTime: 1 }).limit(50);
  }
}

export const eventsService = new EventsService();
