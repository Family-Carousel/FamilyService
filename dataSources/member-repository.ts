import { DynamoUtilities } from './dynamo.utilities';
import { IMember } from '../interfaces/IMember';
import { injectable, inject } from 'inversify';

interface IMemberRepo {
    SaveMember(memberData: IMember): Promise<IMember>;
    DeleteMember(memberId: string): Promise<void>;
    DeleteMemberInSingleFamily(memberId: string, familyId: string | null): Promise<void>;
    GetMemberById(id: string): Promise<IMember | void>;
    GetMemberByCompositKey(id: string, familyId: string): Promise<IMember | void>;
    ListMemberById(id: string): Promise<IMember[] | void>;
    ListMembersByFamilyId(familyId: string): Promise<IMember[] | void>;
}

const tableName: string = process.env.MEMBER_TABLE || 'devMemberTable';

@injectable()
export class MemberRepo implements IMemberRepo {
    protected _dynamoUtilities: DynamoUtilities;

    constructor(@inject(DynamoUtilities) dynamoUtilities: DynamoUtilities) {
        this._dynamoUtilities = dynamoUtilities;
    }

    public async SaveMember(memberData: IMember): Promise<IMember> {
        try {
            const response = await this._dynamoUtilities.PutItem(tableName, memberData);
            return response as IMember;
        } catch (err) {
            console.error('Error updating Member via Dynamo: ', err);
            throw new Error('Error updating Member via Dynamo');
        }
    }

    public async DeleteMember(memberId: string): Promise<void> {
        try {
            const response = await this._dynamoUtilities.DeleteItem(tableName, memberId);
            return response;
        } catch (err) {
            console.error('Error deleting Member via Dynamo: ', err);
            throw new Error('Error deleting Member via Dynamo');
        }
    }

    public async DeleteMemberInSingleFamily(memberId: string, familyId: string | null = null): Promise<void> {
        try {
            const response = await this._dynamoUtilities.DeleteItem(tableName, memberId, 'FamilyId' , familyId);
            return response;
        } catch (err) {
            console.error('Error deleting Member via Dynamo: ', err);
            throw new Error('Error deleting Member via Dynamo');
        }
    }

    public async GetMemberById(id: string): Promise<IMember | void> {
        try {
            const member = await this._dynamoUtilities.Query(tableName, 'Id', id);
            if(member && member.Items && member.Items.length > 0) {
                return member.Items[0] as IMember;
            }
            return;
        } catch (err) {
            console.error('Error getting member by id via Dynamo: ', err);
            throw new Error('Error getting member');
        }
    }

    public async GetMemberByCompositKey(id: string, familyId: string): Promise<IMember | void> {
        try {
            const member = await this._dynamoUtilities.Query(tableName, 'Id', id, null, 'FamilyId', familyId);
            if(member && member.Items && member.Items.length > 0) {
                return member.Items[0] as IMember;
            }
            return;
        } catch (err) {
            console.error('Error getting member by id and familyId via Dynamo: ', err);
            throw new Error('Error getting member for family');
        }
    }

    public async ListMemberById(id: string): Promise<IMember[] | void> {
        try {
            const member = await this._dynamoUtilities.Query(tableName, 'Id', id);
            if(member && member.Items && member.Items.length > 0) {
                return member.Items as IMember[];
            }
            return;
        } catch (err) {
            console.error('Error getting member by id via Dynamo: ', err);
            throw new Error('Error getting member');
        }
    }

    public async ListMembersByFamilyId(familyId: string): Promise<IMember[] | void> {
        try {
            const members = await this._dynamoUtilities.Query(tableName, 'FamilyId', familyId, 'FamilyId_IDX');
            if(members && members.Items && members.Items.length > 0) {
                return members.Items as IMember[];
            }
            return;
        } catch (err) {
            console.error('Error listing members by memberId via Dynamo: ', err);
            throw new Error('Error listing members by memberId');
        }
    }
}
