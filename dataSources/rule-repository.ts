import { DynamoUtilities } from './dynamo.utilities';
import { IRule } from '../interfaces/IRule';
import { injectable, inject } from 'inversify';

interface IRuleRepo {
    SaveRule(ruleData: IRule): Promise<IRule>;
    DeleteRule(FamilyId: string, Id: string | null): Promise<void>;
    ListRulesByFamilyId(familyId: string): Promise<IRule[] | void>;
    GetRuleByCompositKey(familyId: string, id: string): Promise<IRule | void>;
}

const tableName: string = process.env.Rule_TABLE || 'devRuleTable';

@injectable()
export class RuleRepo implements IRuleRepo {
    protected _dynamoUtilities: DynamoUtilities;

    constructor(@inject(DynamoUtilities) dynamoUtilities: DynamoUtilities) {
        this._dynamoUtilities = dynamoUtilities;
    }

    public async SaveRule(ruleData: IRule): Promise<IRule> {
        try {
            const response = await this._dynamoUtilities.PutItem(tableName, ruleData);

            return response as IRule;
        } catch (err) {
            console.error('Error updating Rule via Dynamo: ', err);
            throw new Error('Error updating Rule via Dynamo');
        }
    }

    public async DeleteRule(FamilyId: string, Id: string): Promise<void> {
        try {
            const response = await this._dynamoUtilities.DeleteItem(tableName, FamilyId, 'Id', Id);

            return response;
        } catch (err) {
            console.error('Error deleting via Dynamo: ', err);
            throw new Error('Error deleting Rule via Dynamo');
        }
    }

    public async ListRulesByFamilyId(familyId: string): Promise<IRule[] | void> {
        try {
            const rule = await this._dynamoUtilities.Query(tableName, 'FamilyId', familyId);


            if (rule && rule.Items && rule.Items.length > 0) {
                return rule.Items as IRule[];
            }

            return;
        } catch (err) {
            console.error('Error getting Rules by family id via Dynamo: ', err);
            throw new Error('Error getting Rules');
        }
    }

    public async GetRuleByCompositKey(id: string, familyId: string): Promise<IRule | void> {
        try {
            const event = await this._dynamoUtilities.Query(tableName, 'FamilyId', familyId, null, 'Id', id);
            if(event && event.Items && event.Items.length > 0) {
                return event.Items[0] as IRule;
            }

            return;
        } catch (err) {
            console.error('Error getting Rule by id and familyId via Dynamo: ', err);
            throw new Error('Error getting Rule for family');
        }
    }
};
