import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

import { utilities } from './utilities';
import { familyService } from '../services/FamilyService';
import { memberService } from '../services/MemberService';

export const getFamilyById = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
        }

        const id = event.pathParameters.id;

        let familyReturn = await familyService.GetFamilyById(id);

        if (!familyReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
        }

        const familyWithMembers = await memberService.MapMembersToFamily(familyReturn);

        if (!familyWithMembers) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
        }

        return utilities.BuildResponse(201, JSON.stringify(familyWithMembers));
    } catch (err) {
        console.error('Family Service Get a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}