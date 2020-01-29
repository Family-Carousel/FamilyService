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

        const familyReturn = await familyService.GetFamilyById(id);

        if (!familyReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
        }

        const familyWithMembers = await memberService.MapMembersToFamily(familyReturn);

        if (!familyWithMembers) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
        }

        return utilities.BuildResponse(200, JSON.stringify(familyWithMembers));
    } catch (err) {
        console.error('Family Service Get a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

export const listAllMembersForFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
        }

        const id = event.pathParameters.id;
        
        const memberReturn = await memberService.ListAllMembersByFamilyId(id);

        if (!memberReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Family has no members'));
        }

        return utilities.BuildResponse(200, JSON.stringify(memberReturn));
    } catch (err) {
        console.error('Family Service list all members in family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

export const getMemberById = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
        }

        const id = event.pathParameters.id;

        const memberReturn = await memberService.GetMemberById(id);

        if (!memberReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Member does not exist'));
        }

        return utilities.BuildResponse(200, JSON.stringify(memberReturn));
    } catch (err) {
        console.error('Family Service Get a member error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

export const listAllFamilysForMember = async (
    event: APIGatewayEvent
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
        }

        const id = event.pathParameters.id;

        const response = await memberService.ListAllMembers(id);

        if (!response) {
            return utilities.BuildResponse(404, JSON.stringify('No Members Found'));
        }

        const families = await familyService.ListFamilysForEachMember(response);

        if (!families) {
            return utilities.BuildResponse(404, JSON.stringify('No Families Found Matching any members'));
        }

        const familyWithMembers = await memberService.MapMembersToFamilyList(families);

        if (!familyWithMembers) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
        }

        return utilities.BuildResponse(200, JSON.stringify(familyWithMembers));
    } catch (err) {
        console.error('Family Service Get a member error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}