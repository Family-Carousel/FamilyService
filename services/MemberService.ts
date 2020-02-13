import { IMember } from '../interfaces/IMember';
import { Member } from '../models/Member';
import { MemberRepo } from '../dataSources/member-repository';
import { caseTsJsonValidator } from '../schemas/memberSchema';
import { IFamily } from '../interfaces/IFamily';
import { inject, injectable } from 'inversify';

@injectable()
export class MemberService {
    protected _memberRepo: MemberRepo;

    constructor(@inject(MemberRepo) memberRepo: MemberRepo) {
        this._memberRepo = memberRepo;
    }

    public async createMember(memberData: IMember): Promise<IMember> {
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
            const response = await this._memberRepo.SaveMember(newMember);
            return response as IMember;
        } catch (err) {
            console.error('Failed to save member to data table: ', err);
            throw new Error('Failed to save member to data table');
        }
    }

    public async MapMembersToFamily(family: IFamily): Promise<IFamily> {
        try {
            const members = await this._memberRepo.ListMembersByFamilyId(family.Id);

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
                const members = await this._memberRepo.ListMembersByFamilyId(familyList[f].Id);

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
            const member = await this._memberRepo.GetMemberById(id);
            return member as IMember;
        } catch (err) {
            console.error('Failed to get member by id: ', err);
            throw new Error('Failed to get member by id');
        }
    }

    public async GetMemberByCompositKey(id: string, familyId: string): Promise<IMember> {
        try {
            const member = await this._memberRepo.GetMemberByCompositKey(id, familyId);
            return member as IMember;
        } catch (err) {
            console.error('Failed to get member by id: ', err);
            throw new Error('Failed to get member by id');
        }
    }

    public async ListAllMembersByFamilyId(id: string): Promise<IMember[]> {
        try {
            const members = await this._memberRepo.ListMembersByFamilyId(id);
            return members as IMember[];
        } catch (err) {
            console.error('Failed to get members by familyId: ', err);
            throw new Error('Failed to get members by familyId');
        }
    }

    public async ListAllMembers(id: string): Promise<IMember[]> {
        try {
            const members = await this._memberRepo.ListMemberById(id);
            return members as IMember[];
        } catch (err) {
            console.error('Failed to get members by memberId: ', err);
            throw new Error('Failed to get members by memberId');
        }
    }

    public async DeleteMemberList(members: IMember[]): Promise<boolean> {
        try {
            for (let m = 0; m < members.length; m++) {
                await this._memberRepo.DeleteMemberInSingleFamily(members[m].Id, members[m].FamilyId);
            }
            return true;
        } catch (err) {
            console.error('Failed to delete list of members: ', err);
            throw new Error('Failed to delete list of members');
        }
    }

    public async DeleteMember(member: IMember): Promise<boolean> {
        try {
            await this._memberRepo.DeleteMemberInSingleFamily(member.Id, member.FamilyId);
            return true;
        } catch (err) {
            console.error('Failed to delete member: ', err);
            throw new Error('Failed to delete member');
        }
    }

    public async UpdateMemberForFamily(currentMember: IMember, newMemberData: IMember): Promise<IMember> {
        newMemberData.CreateDateTime = currentMember.CreateDateTime;
        newMemberData.CreateBy = currentMember.CreateBy;

        const updateMember = new Member(newMemberData);

        if (currentMember === updateMember) {
            throw new Error('Update not needed, Current Matches new data');
        }

        try {
            let valid = caseTsJsonValidator(updateMember);

            if (!valid) {
                console.log('Updating Member - Invalid Family Format');
                throw new Error("Updating Member - Invalid Family Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on Member data: ', err);
            throw new Error('Failed to perform validation on Member data');
        }

        try {
            const response = await this._memberRepo.SaveMember(updateMember);
            return response as IMember;
        } catch (err) {
            console.error('Failed to save family to data table: ', err);
            throw new Error('Failed to save family to data table');
        }
    }

    public async UpdateMemberGlobally(currentMemberList: IMember[], newMemberData: IMember): Promise<IMember[]> {
        let updatedMemberList: IMember[] = [];

        for (let m = 0; m < currentMemberList.length; m++) {
            newMemberData.CreateDateTime = currentMemberList[m].CreateDateTime;
            newMemberData.CreateBy = currentMemberList[m].CreateBy;

            const updateMember = new Member(newMemberData);

            updateMember.Id = currentMemberList[m].Id;
            updateMember.FamilyId = currentMemberList[m].FamilyId;

            try {
                let valid = caseTsJsonValidator(updateMember);

                if (!valid) {
                    console.log('Updating Member List - Invalid Family Format');
                    throw new Error("Updating Member List - Invalid Family Format");
                }
            } catch (err) {
                console.error('Failed to perform validation on Member data: ', err);
                throw new Error('Failed to perform validation on Member data');
            }

            try {
                const response = await this._memberRepo.SaveMember(updateMember);
                updatedMemberList.push(response as IMember);
            } catch (err) {
                console.error('Failed to save family to data table: ', err);
                throw new Error('Failed to save family to data table');
            }
        }

        return updatedMemberList;
    }
}
