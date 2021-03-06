import { IMember } from '../interfaces/IMember';

export class Member implements IMember {
    Id: string;
    FamilyId: string;
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
        FamilyId,
        FirstName,
        LastName,
        DateOfBirth,
        ManagedUser,
        EmailAddress,
        CreateBy,
        CreateDateTime
    }: IMember) {
        this.Id = Id;
        this.FamilyId = FamilyId;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.DateOfBirth = DateOfBirth;
        this.ManagedUser = this.ValidateManagedUser(ManagedUser, DateOfBirth);
        this.EmailAddress = EmailAddress;
        this.Age = this.DetermineAge(DateOfBirth);
        this.CreateBy = CreateBy || UserId!;
        this.CreateDateTime = CreateDateTime || new Date(Date.now()).toISOString();
        this.LastUpdateBy = UserId!;
        this.LastUpdateDateTime = new Date(Date.now()).toISOString();
    }

    private DetermineAge(dateOfBirth: string): number {
        var today = new Date();
        var birthDate = new Date(dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    private ValidateManagedUser(managedUser: number | boolean, dateOfBirth: string): number {
        const age = this.DetermineAge(dateOfBirth);
        // User is forced to be a managed user if not at least 12 years of age
        if (age <= 11) {
            return 1;
        } else {
            return managedUser ? 1 : 0;
        }

    }
};
