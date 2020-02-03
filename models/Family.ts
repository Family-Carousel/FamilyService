import { generate } from "shortid";
import { IFamily } from '../interfaces/IFamily';

export class Family implements IFamily {
    Id: string;
    Name: string;
    FamilyOwner: string;
    Description: string;
    Members: [];
    Size: number;
    IsActive: number;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
    constructor({
        Id,
        Name,
        UserId,
        FamilyOwner,
        Description,
        Size,
        IsActive,
        CreateBy,
        CreateDateTime
    }: IFamily) {
        this.Id = Id || generate();
        this.Name = Name;
        this.FamilyOwner =  FamilyOwner || UserId!;
        this.Description = Description;
        this.Members = [];
        this.Size = Size;
        this.IsActive = IsActive ? 1 : 0;
        this.CreateBy = CreateBy || UserId!;
        this.CreateDateTime = CreateDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = UserId!;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
