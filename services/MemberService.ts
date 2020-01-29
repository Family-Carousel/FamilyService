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

            if (members && members.Items && members.Items.length > 0) {
                for (let m = 0; m <= members.Items.length; m++) {
                    if (members.Items[m]) {
                        family.Members?.push(members.Items[m]);
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
        // TODO: maps multiple families to multiple members. figure this out.
        console.log(familyList);
        try {

            for (let f = 0; f < familyList.length; f++) {
                const members = await memberRepo.ListMembersByFamilyId(familyList[f].Id);

                if (members && members.length > 0) {
                    for (let m = 0; m <= members.length; m++) {
                        if (members[m]) {
                            familyList[f].Members?.push(members[m]);
                        }
                    }
                }
            }

            console.log(familyList);
            return familyList;
        } catch (err) {
            console.error('Failed to map members to family list: ', err);
            throw new Error('Failed to map members to family list');
        }
    }

    public async GetMemberById(id: string) {
        if (!id) {
            return;
        }

        try {
            const member = memberRepo.GetMemberById(id);
            return member;
        } catch (err) {
            console.error('Failed to get member by id: ', err);
            throw new Error('Failed to get member by id');
        }
    }

    public async ListAllMembersByFamilyId(id: string) {
        if (!id) {
            return;
        }

        try {
            const members = memberRepo.ListMembersByFamilyId(id);
            return members;
        } catch (err) {
            console.error('Failed to get members by familyId: ', err);
            throw new Error('Failed to get members by familyId');
        }
    }

    public async ListAllMembers(id: string) {
        if (!id) {
            return;
        }

        try {
            const members = memberRepo.ListMemberById(id);
            return members;
        } catch (err) {
            console.error('Failed to get members by memberId: ', err);
            throw new Error('Failed to get members by memberId');
        }
    }
}

export const memberService = new MemberService();