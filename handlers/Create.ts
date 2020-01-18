import 'source-map-support/register'
import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda';

const utils = require('../handlers/utilities');
import { familyService } from '../services/familyService';

let familyData: string;
let serverReturn: any;

export const createFamily = async (
    event: APIGatewayEvent,
    context: Context
): Promise<ProxyResult> => {
    try {
        if (!event.body) {
            return utils.buildResponse(400, JSON.stringify('Object to create was not provided'));
        }
        familyData = JSON.parse(event.body);
        serverReturn = await familyService.createFamily(familyData);

        if (!serverReturn) {
            return utils.buildResponse(404, JSON.stringify('Failed to create Family'));
        }

        return utils.buildResponse(201, JSON.stringify(serverReturn));
    } catch(err) {
        console.error('Family Service Create a family error: ' + err);
        return utils.buildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}
