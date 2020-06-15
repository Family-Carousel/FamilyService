import { createSchema as S, TsjsonParser } from 'ts-json-validator';
import { IRule } from '../interfaces/IRule';

const parser = new TsjsonParser(S({
    type: 'object',
    properties: {
        FamilyId: S({ type: 'string' }),
        Id: S({ type: 'string' }),
        Name: S({ type: 'string' }),
        Details: S({type: 'string'}),
        Color: S({type: 'string'}),
        AppliesToUserId: S({type: 'string'}),
        CreateBy: S({type: 'string'}),
        CreateDateTime: S({type: 'string'}),
        LastUpdateBy: S({type: 'string'}),
        LastUpdateDateTime: S({type: 'string'})
    },
    required: ['Id', 'FamilyId', 'Name', 'Color', 'AppliesToUserId', 'CreateBy', 'CreateDateTime', 'LastUpdateBy', 'LastUpdateDateTime']
}));

export function caseTsJsonValidator(data: IRule) {
    if (parser.validates(data)) {
        return data;
    }

    throw new Error(`Invalid ${JSON.stringify(parser.getErrors())}`);
};
