import { IMember } from '../interfaces/IMember';
import { ICalendar } from '../interfaces/ICalendar';

export interface IFamily {
    Id: string;
    Name: string;
    FamilyOwner: string;
    UserId?:string;
    Members?: IMember[]
    CalendarItems?: ICalendar[]
    Description: string;
    Size: number;
    Color: string;
    IsActive: number | boolean;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
}