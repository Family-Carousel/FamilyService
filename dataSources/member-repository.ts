import { DynamoUtils } from './dynamo.utilities';
import { IMember } from '../interfaces/IMember';
const tableName: string = process.env.MEMBER_TABLE || 'devMemberTable';

class MemberRepo {

    public async SaveMember(memberData: IMember) {
        try {
            const response = await DynamoUtils.PutItem(tableName, memberData);
            return response;
        } catch (err) {
            console.error('Error updating Member via Dynamo: ', err);
            throw new Error('Error updating Member via Dynamo');
        }
    }

    public async DeleteMember(memberId: string) {
        try {
            const response = await DynamoUtils.DeleteItem(tableName, memberId);
            return response;
        } catch (err) {
            console.error('Error deleting Member via Dynamo: ', err);
            throw new Error('Error deleting Member via Dynamo');
        }
    }

    public async GetMemberById(id: string) {
        try {
            const member = await DynamoUtils.Query(tableName, 'Id', id);
            if(member && member.Items && member.Items.length > 0) {
                return member.Items[0];
            }
            return;
        } catch (err) {
            console.error('Error getting member by id via Dynamo: ', err);
            throw new Error('Error getting member');
        }
    }

    public async ListMemberById(id: string) {
        try {
            const member = await DynamoUtils.Query(tableName, 'Id', id);
            if(member && member.Items && member.Items.length > 0) {
                return member.Items;
            }
            return;
        } catch (err) {
            console.error('Error getting member by id via Dynamo: ', err);
            throw new Error('Error getting member');
        }
    }

    public async ListMembersByFamilyId(familyId: string) {
        try {
            const members = await DynamoUtils.Query(tableName, 'FamilyId', familyId, 'FamilyId_IDX');
            if(members && members.Items && members.Items.length > 0) {
                return members.Items;
            }
            return;
        } catch (err) {
            console.error('Error listing members by memberId via Dynamo: ', err);
            throw new Error('Error listing members by memberId');
        }
    }
}

export const memberRepo = new MemberRepo();
