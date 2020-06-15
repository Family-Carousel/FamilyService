import { ICalendar } from '../interfaces/ICalendar';
import { IFamily } from '../interfaces/IFamily';
import { Calendar } from '../models/Calendar';
import { CalendarRepo } from '../dataSources/calendar-repository';
import { caseTsJsonValidator } from '../schemas/calendarSchema';
import { inject, injectable } from 'inversify';

@injectable()
export class CalendarService {
    protected _calendarRepo: CalendarRepo;

    constructor(@inject(CalendarRepo) CalendarRepo: CalendarRepo) {
        this._calendarRepo = CalendarRepo;
    }

    public async createCalendarEvent(calendarData: ICalendar): Promise<ICalendar> {
        const newEvent = new Calendar(calendarData);

        try {
            let valid = caseTsJsonValidator(newEvent);

            if (!valid) {
                console.log('Creating Event - Invalid Calendar Format');
                throw new Error("Creating Event - Invalid Calendar Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on Calendar data: ', err);
            throw new Error('Failed to perform validation on Calendar data');
        }

        try {
            const response = await this._calendarRepo.SaveCalendarEvent(newEvent);
            return response as ICalendar;
        } catch (err) {``
            console.error('Failed to save Calendar Event to data table: ', err);
            throw new Error('Failed to save Calendar Event to data table');
        }
    }

    public async GetCalendarEventByCompositKey(familyId: string, id: string): Promise<ICalendar> {
        try {
            const event = await this._calendarRepo.GetCalendarEventByCompositKey(id, familyId);
            return event as ICalendar;
        } catch (err) {
            console.error('Failed to get Calendar Event by id: ', err);
            throw new Error('Failed to get Calendar Event by id');
        }
    }

    public async MapCalendarEventsToFamily(family: IFamily): Promise<IFamily> {
        try {
            const events = await this._calendarRepo.ListEventsByFamilyId(family.Id);

            if (events && events.length > 0) {
                for (let e = 0; e <= events.length; e++) {
                    if (events[e]) {
                        family.CalendarItems?.push(events[e] as ICalendar);
                    }
                }
            }

            return family;
        } catch (err) {
            console.error('Failed to map Calendar Events to family: ', err);
            throw new Error('Failed to map Calendar Events to family');
        }
    }

    public async DeleteCalendarEventList(events: ICalendar[]): Promise<boolean> {
        try {
            for (let e = 0; e < events.length; e++) {
                await this._calendarRepo.DeleteCalendarEvent(events[e].FamilyId, events[e].Id);
            }
            return true;
        } catch (err) {
            console.error('Failed to delete list of Events: ', err);
            throw new Error('Failed to delete list of Events');
        }
    }

    public async ListAllCalendarEventsByFamilyId(familyId: string): Promise<ICalendar[]> {
        try {
            const events = await this._calendarRepo.ListEventsByFamilyId(familyId);
            return events as ICalendar[];
        } catch (err) {
            console.error('Failed to get Calendar Events by familyId: ', err);
            throw new Error('Failed to get Calendar Events by familyId');
        }
    }

    public async DeleteCalenderEvent(event: ICalendar): Promise<boolean> {
        try {
            await this._calendarRepo.DeleteCalendarEvent(event.FamilyId, event.Id);
            return true;
        } catch (err) {
            console.error('Failed to delete Calendar Event: ', err);
            throw new Error('Failed to delete Calendar Event');
        }
    }

    public async UpdateCalenderEvent(currentEvent: ICalendar, newEventData: ICalendar): Promise<ICalendar> {
        newEventData.CreateDateTime = currentEvent.CreateDateTime;
        newEventData.CreateBy = currentEvent.CreateBy;

        const updatedEvent = new Calendar(newEventData);

        if (currentEvent === updatedEvent) {
            throw new Error('Update not needed, Current Matches new data');
        }

        try {
            let valid = caseTsJsonValidator(updatedEvent);

            if (!valid) {
                console.log('Updating Event - Invalid Calendar Event Format');
                throw new Error("Updating Event - Invalid Calendar Event Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on Event data: ', err);
            throw new Error('Failed to perform validation on Event data');
        }

        try {
            const response = await this._calendarRepo.SaveCalendarEvent(updatedEvent);
            return response as ICalendar;
        } catch (err) {
            console.error('Failed to save Calendar Event to data table: ', err);
            throw new Error('Failed to save Calendar Event to data table');
        }
    }
}
