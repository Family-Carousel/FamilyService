import { IMember } from '../interfaces/IMember';

export interface IFamily {
    Id: string;
    Name: string;
    FamilyOwner: string;
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