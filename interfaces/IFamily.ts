import { IMember } from './IMember';
import { ICalendar } from './ICalendar';
import { IRule } from './IRule';

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
    UsesRules: number | boolean;
    Rules: IRule[];
    IsActive: number | boolean;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
};