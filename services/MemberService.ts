import { IMember } from '../interfaces/IMember';
import { Member } from '../models/Member';
import { memberRepo } from '../dataSources/member-repository';
import { caseTsJsonValidator } from '../schemas/memberSchema';
import { IFamily } from '../interfaces/IFamily';

class MemberService {

    public async createMember(memberData: IMember) {
        if (!memberData) {
            return;
        }

        const newMember = new Member(memberData);

        try {
            let valid = caseTsJsonValidator(newMember);

            if (!valid) {
                console.log('Creating Member - Invalid Member Format');
                throw new Error("Creating Member - Invalid Member Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on member data: ', err);
            throw new Error('Failed to perform validation on member data');
        }

        try {
            const response = await memberRepo.SaveMember(newMember);
            return response;
        } catch (err) {
            console.error('Failed to save member to data table: ', err);
            throw new Error('Failed to save member to data table');
        }
    }

    public async MapMembersToFamily(family: IFamily): Promise<IFamily> {
        try {
            const members = await memberRepo.ListMembersByFamilyId(family.Id);

            if (members && members.length > 0) {
                for (let m = 0; m <= members.length; m++) {
                    if (members[m]) {
                        family.Members?.push(members[m] as IMember);
                    }
                }
            }

            return family;
        } catch (err) {
            console.error('Failed to map members to family: ', err);
            throw new Error('Failed to map members to family');
        }
    }

    public async MapMembersToFamilyList(familyList: IFamily[]): Promise<IFamily[]> {
        try {
            for (let f = 0; f < familyList.length; f++) {
                const members = await memberRepo.ListMembersByFamilyId(familyList[f].Id);

                if (members && members.length > 0) {
                    for (let m = 0; m <= members.length; m++) {
                        if (members[m]) {
                            familyList[f].Members?.push(members[m] as IMember);
                        }
                    }
                }
            }

            return familyList;
        } catch (err) {
            console.error('Failed to map members to family list: ', err);
            throw new Error('Failed to map members to family list');
        }
    }

    public async GetMemberById(id: string): Promise<IMember> {
        try {
            const member = memberRepo.GetMemberById(id);
            return member as Promise<IMember>;
        } catch (err) {
            console.error('Failed to get member by id: ', err);
            throw new Error('Failed to get member by id');
        }
    }

    public async ListAllMembersByFamilyId(id: string): Promise<IMember[]> {
        try {
            const members = memberRepo.ListMembersByFamilyId(id);
            return members as Promise<IMember[]>;
        } catch (err) {
            console.error('Failed to get members by familyId: ', err);
            throw new Error('Failed to get members by familyId');
        }
    }

    public async ListAllMembers(id: string): Promise<IMember[]> {
        try {
            const members = memberRepo.ListMemberById(id);
            return members as  Promise<IMember[]>;
        } catch (err) {
            console.error('Failed to get members by memberId: ', err);
            throw new Error('Failed to get members by memberId');
        }
    }

    public async DeleteMemberList(members: IMember[]): Promise<boolean> {
        if (!members) {
            return false;
        }

        try {
            for(let m = 0; m < members.length; m++) {
                await memberRepo.DeleteMember(members[m].Id);
            }
            return true;
        } catch (err) {
            console.error('Failed to delete list of members: ', err);
            throw new Error('Failed to delete list of members');
        }
    }

    public async DeleteMember(member: IMember): Promise<boolean> {
        if (!member) {
            return false;
        }

        try {
            await memberRepo.DeleteMemberInSingleFamily(member.Id, member.FamilyId);
            return true;
        } catch (err) {
            console.error('Failed to delete member: ', err);
            throw new Error('Failed to delete member');
        }
    }
}

export const memberService = new MemberService();