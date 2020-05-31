import { DynamoUtilities } from './dynamo.utilities';
import { ICalendar } from '../interfaces/ICalendar';
import { injectable, inject } from 'inversify';

interface ICalendarRepo {
    SaveCalendarEvent(calendarData: ICalendar): Promise<ICalendar>;
    DeleteCalendarEvent(FamilyId: string, Id: string | null): Promise<void>;
    ListEventsByFamilyId(familyId: string): Promise<ICalendar[] | void>;
    GetCalendarEventByCompositKey(familyId: string, id: string): Promise<ICalendar | void>;
}

const tableName: string = process.env.CALENDAR_TABLE || 'devCalendarTable';

@injectable()
export class CalendarRepo implements ICalendarRepo {
    protected _dynamoUtilities: DynamoUtilities;

    constructor(@inject(DynamoUtilities) dynamoUtilities: DynamoUtilities) {
        this._dynamoUtilities = dynamoUtilities;
    }

    public async SaveCalendarEvent(calendarData: ICalendar): Promise<ICalendar> {
        try {
            const response = await this._dynamoUtilities.PutItem(tableName, calendarData);

            return response as ICalendar;
        } catch (err) {
            console.error('Error updating Calendar event via Dynamo: ', err);
            throw new Error('Error updating Calendar event via Dynamo');
        }
    }

    public async DeleteCalendarEvent(FamilyId: string, Id: string): Promise<void> {
        try {
            const response = await this._dynamoUtilities.DeleteItem(tableName, FamilyId, 'Id', Id);

            return response;
        } catch (err) {
            console.error('Error deleting Calendar Event via Dynamo: ', err);
            throw new Error('Error deleting Calendar Event via Dynamo');
        }
    }

    public async ListEventsByFamilyId(familyId: string): Promise<ICalendar[] | void> {
        try {
            const calendar = await this._dynamoUtilities.Query(tableName, 'FamilyId', familyId);

            console.log('calendar return: ', calendar);

            if (calendar && calendar.Items && calendar.Items.length > 0) {
                return calendar.Items as ICalendar[];
            }

            return;
        } catch (err) {
            console.error('Error getting Calendar Events by family id via Dynamo: ', err);
            throw new Error('Error getting Calendar Events');
        }
    }

    public async GetCalendarEventByCompositKey(id: string, familyId: string): Promise<ICalendar | void> {
        try {
            const event = await this._dynamoUtilities.Query(tableName, 'FamilyId', familyId, null, 'Id', id);
            if(event && event.Items && event.Items.length > 0) {
                return event.Items[0] as ICalendar;
            }

            return;
        } catch (err) {
            console.error('Error getting Calendar Event by id and familyId via Dynamo: ', err);
            throw new Error('Error getting Calendar event for family');
        }
    }
}
