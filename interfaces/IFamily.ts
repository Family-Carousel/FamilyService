import { IMember } from './IMember';

export interface IFamily {
    Id: string;
    Name: string;
    UserId?:string;
    Members?: IMember[]
    Description: string;
    Size: number;
    IsActive: number;
    CreatedBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
}