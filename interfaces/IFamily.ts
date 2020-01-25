import { IMember } from './IMember';

export interface IFamily {
    Id: string;
    Name: string;
    FamilyCreator: string;
    UserId?:string;
    Members?: IMember[]
    Description: string;
    Size: number;
    IsActive: number | boolean;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
}