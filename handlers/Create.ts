import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

import { utilities } from './utilities';
import { familyService } from '../services/FamilyService';
import { IFamily } from '../interfaces/IFamily';

let familyData: IFamily;
let serverReturn: IFamily;

export const createFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
        }
        familyData = JSON.parse(event.body);
        serverReturn = await familyService.createFamily(familyData);

        if (!serverReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Failed to create Family'));
        }

        return utilities.BuildResponse(201, JSON.stringify(serverReturn));
    } catch(err) {
        console.error('Family Service Create a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}
