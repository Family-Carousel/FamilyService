import { APIGatewayEvent, ProxyResult } from 'aws-lambda';

import { utilities } from './utilities';
import { familyService } from '../services/FamilyService';
import { memberService } from '../services/MemberService';

export const updateFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id is required in path to perform update'));
        }

        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
        }

        const id = event.pathParameters.id;
        let newFamilyData = JSON.parse(event.body);


        if (id !== newFamilyData.Id ) {
            return utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match Id in Path'));
        }

        const currentFamily = familyService.GetFamilyById(id);

        if (!currentFamily) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist. Is your Id wrong?'));
        }

        const updatedFamily = await familyService.UpdateFamily(currentFamily, newFamilyData);

        if (!updatedFamily) {
            return utilities.BuildResponse(404, JSON.stringify('Family update not successful'));
        }

        return utilities.BuildResponse(200, updatedFamily);
    } catch (err) {
        console.error('Family Service family update failure: ' + err);
        return utilities.BuildResponse(400, 'Family Service family update failure');
    }
}

export const updateMember = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
        }
        const memberData = JSON.parse(event.body);
        const memberServerReturn = await memberService.createMember(memberData);

        if (!memberServerReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Failed to create Member'));
        }

        return utilities.BuildResponse(201, JSON.stringify(memberServerReturn));
    } catch(err) {
        console.error('Family Service Create a member error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}