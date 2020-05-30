import { generate } from "shortid";
import { ICalendar } from '../interfaces/ICalendar';

export class Calendar implements ICalendar {
    Id: string;
    FamilyId: string;
    Name: string;
    Details: string;
    Start: string;
    End: string;
    Color: string;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
    constructor({
        Id,
        UserId,
        FamilyId,
        Name,
        Details,
        Color,
        Start,
        End,
        CreateBy,
        CreateDateTime
    }: ICalendar) {
        this.Id = Id || generate();
        this.FamilyId = FamilyId;
        this.Name = Name;
        this.Details = Details;
        this.Start = Start;
        this.End = End;
        this.Color = Color;
        this.CreateBy = CreateBy || UserId!;
        this.CreateDateTime = CreateDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = UserId!;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
