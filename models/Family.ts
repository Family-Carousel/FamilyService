import { generate } from "shortid";
import { IFamily } from '../interfaces/IFamily';

export class Family implements IFamily {
    Id: string;
    MemberId: string;
    Name: string;
    Description: string;
    Size: number;
    IsActive: number;
    CreatedBy: string;
    CreatedDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
    constructor({
        Id,
        MemberId,
        Name,
        Description,
        Size,
        IsActive,
        CreatedBy,
        CreatedDateTime
    }: IFamily) {
        this.Id = Id || generate();
        this.MemberId = MemberId;
        this.Name = Name;
        this.Description = Description;
        this.Size = Size;
        this.IsActive = IsActive ? 1 : 0;
        this.CreatedBy = CreatedBy || MemberId;
        this.CreatedDateTime = CreatedDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = MemberId;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
