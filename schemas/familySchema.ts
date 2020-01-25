import { createSchema as S, TsjsonParser } from 'ts-json-validator';
import { IFamily } from '../interfaces/IFamily';

const parser = new TsjsonParser(S({
    type: 'object',
    properties: {
        Id: S({ type: 'string' }),
        FamilyCreator: S({ type: 'string' }),
        Members: S({ type: 'array' }),
        Name: S({type: 'string'}),
        Description: S({type: 'string'}),
        Size: S({type: 'number'}),
        IsActive: S({type: 'number'}),
        CreateBy: S({type: 'string'}),
        CreateDateTime: S({type: 'string'}),
        LastUpdateBy: S({type: 'string'}),
        LastUpdateDateTime: S({type: 'string'})
    },
    required: ['Id', 'FamilyCreator', 'Name', 'IsActive', 'CreateBy', 'LastUpdateBy', 'CreateDateTime', 'LastUpdateDateTime', 'Size']
}))

export function caseTsJsonValidator(data: IFamily) {
    if (parser.validates(data)) {
        return data;
    }

    throw new Error(`Invalid ${JSON.stringify(parser.getErrors())}`);
}
