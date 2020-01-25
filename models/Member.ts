import { IMember } from '../interfaces/IMember';

export class Member implements IMember {
    Id: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
    ManagedUser: boolean;
    EmailAddress: string;
    Age: number;
    CreateBy: string;
    CreateDateTime: string;
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
    }: IMember) {
        this.Id = Id;
        this.FirstName = MemberId;
        this.LastName = Name;
        this.DateOfBirth = Description;
        this.ManagedUser = ManagedUser ? 1 : 0;
        this.EmailAddress = EmailAddress;
        this.Age = Age;
        this.CreatedBy = CreatedBy || MemberId;
        this.CreatedDateTime = CreatedDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = MemberId;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }
};
