import { IMember } from '../interfaces/IMember';

export class Member implements IMember {
    Id: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
    ManagedUser: number;
    EmailAddress: string;
    Age: number;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateBy: string;
    LastUpdateDateTime: string;
    constructor({
        Id,
        UserId,
        FirstName,
        LastName,
        DateOfBirth,
        ManagedUser,
        EmailAddress,
        Age,
        CreateBy,
        CreateDateTime
    }: IMember) {
        this.Id = Id;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.DateOfBirth = DateOfBirth;
        this.ManagedUser = ManagedUser ? 1 : 0;
        this.EmailAddress = EmailAddress;
        this.Age = Age;
        this.CreateBy = CreateBy || UserId!;
        this.CreateDateTime = CreateDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = UserId!;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
