import { DynamoUtilities } from './dynamo.utilities';
import { IFamily } from '../interfaces/IFamily';
import { injectable } from 'inversify';

export interface IFamilyRepo {
    SaveFamily(familydata: IFamily): Promise<IFamily>;
    DeleteFamily(familyId: string): Promise<void>;
    GetFamilyById(familyId: string): Promise<IFamily | void>
    ListAllFamilysForMember(memberId: string): Promise<IFamily[]>
}

const tableName: string = process.env.FAMILY_TABLE || 'devFamilyTable';

@injectable()
export class FamilyRepo implements IFamilyRepo {

    public async SaveFamily(familyData: IFamily): Promise<IFamily> {
        try {
            const response = await DynamoUtilities.PutItem(tableName, familyData);
            return response as IFamily;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }

    public async DeleteFamily(familyId: string): Promise<void> {
        try {
            const response = await DynamoUtilities.DeleteItem(tableName, familyId);
            return response;
        } catch (err) {
            console.error('Error updating family via Dynamo: ', err);
            throw new Error('Error updating family via Dynamo');
        }
    }

    public async GetFamilyById(id: string): Promise<IFamily | void> {
        try {
            const family = await DynamoUtilities.Query(tableName, 'Id', id);
            if (family && family.Items && family.Items.length > 0) {
                return family.Items[0] as IFamily;
            }
            return;
        } catch (err) {
            console.error('Error getting family by id via Dynamo: ', err);
            throw new Error('Error getting family');
        }
    }

    public async ListAllFamilysForMember(memberId: string): Promise<IFamily[]> {
        try {
            const familyList = await DynamoUtilities.Query(tableName, 'MemberId', memberId);
            return familyList as IFamily[];
        } catch (err) {
            console.error('Error listing families for member: ', err);
            throw new Error('Error listing families for member');
        }
    }
}
