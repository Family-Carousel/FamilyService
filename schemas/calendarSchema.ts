import { createSchema as S, TsjsonParser } from 'ts-json-validator';
import { ICalendar } from '../interfaces/ICalendar';

const parser = new TsjsonParser(S({
    type: 'object',
    properties: {
        FamilyId: S({ type: 'string' }),
        Id: S({ type: 'string' }),
        Name: S({ type: 'string' }),
        Details: S({type: 'string'}),
        Color: S({type: 'string'}),
        Start: S({type: 'number'}),
        End: S({type: 'string'}),
        CreateBy: S({type: 'string'}),
        CreateDateTime: S({type: 'string'}),
        LastUpdateBy: S({type: 'string'}),
        LastUpdateDateTime: S({type: 'string'})
    },
    required: ['Id', 'FamilyId', 'Name', 'Color', 'Start', 'End', 'CreateBy', 'CreateDateTime', 'LastUpdateBy', 'LastUpdateDateTime']
}))

export function caseTsJsonValidator(data: ICalendar) {
    if (parser.validates(data)) {
        return data;
    }

    throw new Error(`Invalid ${JSON.stringify(parser.getErrors())}`);
}
