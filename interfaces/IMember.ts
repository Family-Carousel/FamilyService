export interface IMember {
    Id: string;
    FamilyId: string;
    UserId?: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
    ManagedUser: number;
    EmailAddress: string;
    Age: number;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateDateTime: string;
    LastUpdateBy: string
}