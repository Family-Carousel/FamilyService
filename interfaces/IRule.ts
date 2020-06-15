export interface IRule {
    Id: string;
    FamilyId: string;
    UserId?: string
    Name: string;
    Details: string;
    FamilyRule: number;
    AppliesToUsers?: string[];
    Color: string;
    CreateBy: string;
    CreateDateTime: string;
    LastUpdateDateTime: string;
    LastUpdateBy: string
};
