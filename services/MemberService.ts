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

    public async MapMembersToFamily(family: IFamily) {
        const members = await memberRepo.ListMembersByFamilyId(family.Id);

        if (members && members.Items && members.Items.length > 0) {
            for (let m = 0; m <= members.Items.length; m++) {
                family.Members?.push(members.Items[m]);
            }
        }
    }
}

export const memberService = new MemberService();