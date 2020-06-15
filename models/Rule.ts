import { generate } from "shortid";
import { IRule } from '../interfaces/IRule';

export class Rule implements IRule {
    Id: string;
    FamilyId: string;
    UserId?: string
    Name: string;
    Details: string;
    AppliesToUserId: string;
    Color: string;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateDateTime: string;
    LastUpdateBy: string
    constructor({
        Id,
        UserId,
        FamilyId,
        Name,
        Details,
        Color,
        AppliesToUserId,
        CreateBy,
        CreateDateTime
    }: IRule) {
        this.Id = Id || generate();
        this.FamilyId = FamilyId;
        this.Name = Name;
        this.Details = Details;
        this.AppliesToUserId = AppliesToUserId;
        this.Color = Color;
        this.CreateBy = CreateBy || UserId!;
        this.CreateDateTime = CreateDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = UserId!;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
