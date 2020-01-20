import { createSchema as S, TsjsonParser } from 'ts-json-validator';
import { IFamily } from '../interfaces/IFamily';

const parser = new TsjsonParser(S({
    type: 'object',
    properties: {
        Id: S({ type: 'string' }),
        MemberId: S({ type: 'string' }),
        Name: S({type: 'string'}),
        Description: S({type: 'string'}),
        Size: S({type: 'number'}),
        IsActive: S({type: 'number'}),
        CreatedBy: S({type: 'string'}),
        CreatedDateTime: S({type: 'string'}),
        LastUpdateBy: S({type: 'string'}),
        LastUpdateDateTime: S({type: 'string'})
    },
    required: ['Id', 'MemberId', 'Name', 'IsActive']
}))

export function caseTsJsonValidator(data: IFamily) {
    if (parser.validates(data)) {
        return data;
    }

    throw new Error(`Invalid ${parser.getErrors()}`);
}
