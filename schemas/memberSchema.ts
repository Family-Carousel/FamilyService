import { createSchema as S, TsjsonParser } from 'ts-json-validator';
import { IMember } from '../interfaces/IMember';

const parser = new TsjsonParser(S({
    type: 'object',
    properties: {
        Id: S({ type: 'string' }),
        FamilyId: S({ type: 'string' }),
        FirstName: S({ type: 'string' }),
        LastName: S({type: 'string'}),
        DateOfBirth: S({type: 'string'}),
        ManagedUser: S({type: 'number'}),
        EmailAddress: S({type: 'string'}),
        Color: S({type: 'string'}),
        Age: S({type: 'number'}),
        CreateBy: S({type: 'string'}),
        CreateDateTime: S({type: 'string'}),
        LastUpdateBy: S({type: 'string'}),
        LastUpdateDateTime: S({type: 'string'})
    },
    required: ['Id', 'FamilyId', 'FirstName', 'DateOfBirth', 'Color', 'ManagedUser', 'EmailAddress', 'CreateBy', 'CreateDateTime', 'LastUpdateBy', 'LastUpdateDateTime']
}))

export function caseTsJsonValidator(data: IMember) {
    if (parser.validates(data)) {
        return data;
    }

    throw new Error(`Invalid ${JSON.stringify(parser.getErrors())}`);
}
