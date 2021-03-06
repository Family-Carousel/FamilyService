import { DynamoUtilities } from './dynamo.utilities';
import { IFamily } from '../interfaces/IFamily';
import { injectable, inject } from 'inversify';

export interface IFamilyRepo {
    SaveFamily(familydata: IFamily): Promise<IFamily>;
    DeleteFamily(familyId: string): Promise<void>;
    GetFamilyById(familyId: string): Promise<IFamily | void>
    ListAllFamilysForMember(memberId: string): Promise<IFamily[]>
}

const tableName: string = process.env.FAMILY_TABLE || 'devFamilyTable';

@injectable()
export class FamilyRepo implements IFamilyRepo {
    protected _dynamoUtilities: DynamoUtilities;

    constructor(@inject(DynamoUtilities) dynamoUtilities: DynamoUtilities) {
        this._dynamoUtilities = dynamoUtilities;
    }

    public async SaveFamily(familyData: IFamily): Promise<IFamily> {
        try {
            const response = await this._dynamoUtilities.PutItem(tableName, familyData);
            return response as IFamily;
        } catch (err) {
            console.error('Error Saving family via Dynamo: ', err);
            throw new Error('Error Saving family via Dynamo');
        }
    }

    public async DeleteFamily(familyId: string): Promise<void> {
        try {
            const response = await this._dynamoUtilities.DeleteItem(tableName, familyId);
            return response;
        } catch (err) {
            console.error('Error deleting family via Dynamo: ', err);
            throw new Error('Error deleting family via Dynamo');
        }
    }

    public async GetFamilyById(id: string): Promise<IFamily | void> {
        try {
            const family = await this._dynamoUtilities.Query(tableName, 'Id', id);
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
            const familyList = await this._dynamoUtilities.Query(tableName, 'MemberId', memberId);
            return familyList as IFamily[];
        } catch (err) {
            console.error('Error listing families for member: ', err);
            throw new Error('Error listing families for member');
        }
    }
}
