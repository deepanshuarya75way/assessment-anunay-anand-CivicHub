import { Request, Response } from 'express';
import { eventsService } from './services/events.service';
import { attendanceService } from './services/attendance.service';
import { checkInService } from './services/checkin.service';

export class EventsController {
  async createEvent(req: Request, res: Response) {
    try {
      // In a real app, (req as any).user would be set by auth middleware
      const event = await eventsService.createEvent(req.body, (req as any).user?.id || 'unknown');
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const event = await eventsService.getEvent(req.params.id);
      res.json(event);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateEventStatus(req: Request, res: Response) {
    try {
      const event = await eventsService.updateEventStatus(req.params.id, req.body.status, (req as any).user?.id || 'unknown');
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addScheduleItem(req: Request, res: Response) {
    try {
      const event = await eventsService.addScheduleItem(req.params.id, req.body, (req as any).user?.id || 'unknown');
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addAnnouncement(req: Request, res: Response) {
    try {
      const event = await eventsService.addAnnouncement(req.params.id, req.body, (req as any).user?.id || 'unknown');
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async discoverEvents(req: Request, res: Response) {
    try {
      const filters = req.query;
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
      const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
      const maxDistance = req.query.maxDistance ? parseFloat(req.query.maxDistance as string) : 10000;

      const events = await eventsService.discoverEvents(filters, lat, lng, maxDistance);
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const attendance = await attendanceService.register(req.params.id, (req as any).user?.id || 'unknown');
      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelRegistration(req: Request, res: Response) {
    try {
      const attendance = await attendanceService.cancelRegistration(req.params.id, (req as any).user?.id || 'unknown');
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async processCheckIn(req: Request, res: Response) {
    try {
      const providerName = req.body.provider || 'QR';
      const result = await checkInService.processCheckIn(providerName, req.body.data, {
        eventId: req.params.id,
        userId: req.body.userId, // Who is being checked in
        timestamp: new Date(),
        organizerId: (req as any).user?.id || 'unknown',
        deviceInfo: req.headers['user-agent']
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json(result.attendanceRecord);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async approveHours(req: Request, res: Response) {
    try {
      const attendance = await attendanceService.approveHours(
        req.params.id,
        req.body.userId,
        req.body.hours,
        (req as any).user?.id || 'unknown'
      );
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const eventsController = new EventsController();
