import { generate } from "shortid";
import { IFamily } from '../interfaces/IFamily';
import { IMember } from '../interfaces/IMember';

export class Family implements IFamily {
    Id: string;
    Name: string;
    FamilyCreator: string;
    Description: string;
    Members: IMember[];
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
        Members,
        Description,
        Size,
        IsActive,
        CreateBy,
        CreateDateTime
    }: IFamily) {
        this.Id = Id || generate();
        this.Name = Name;
        this.FamilyCreator = UserId!;
        this.Description = Description;
        this.Members = Members || [];
        this.Size = Size;
        this.IsActive = IsActive ? 1 : 0;
        this.CreateBy = CreateBy || UserId!;
        this.CreateDateTime = CreateDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = UserId!;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
