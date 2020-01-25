import { DynamoUtils } from './dynamo.utilities';
import { IFamily } from '../interfaces/IFamily';
const tableName: string = process.env.FAMILY_TABLE || 'devFamilyTable';

class FamilyRepo {

    public async SaveFamily(familyData: IFamily) {
        try {
            const response = await DynamoUtils.PutItem(tableName, familyData);
            return response;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }

    public async DeleteFamily(familyId: string) {
        try {
            const response = await DynamoUtils.DeleteItem(tableName, familyId);
            return response;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }

    public async GetFamilyById(id: string) {
        try {
            return await DynamoUtils.Query(tableName, 'Id', id);
        } catch (err) {
            console.error('Error getting family by id via Dynamo: ', err);
            throw new Error('Error getting family');
        }
    }

    public async ListMemberOfFamilyByCompositKey(familyId: string, memberId: string) {
        try {
            return await DynamoUtils.Query(tableName, 'FamilyId', familyId, null, 'MemberId', memberId);
        } catch (err) {
            console.error('Error listing member of family: ', err);
            throw new Error('Error listing member of family');
        }
    }
}

export const familyRepo = new FamilyRepo();
