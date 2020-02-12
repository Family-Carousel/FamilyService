import 'reflect-metadata';
import * as sourceMaps from 'source-map-support';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
sourceMaps.install();

import DIContainer from '../di-container';
import { utilities } from './utilities';
import { FamilyService } from '../services/FamilyService';
import { MemberService } from '../services/MemberService';

const familyService: FamilyService = DIContainer.resolve<FamilyService>(FamilyService);
const memberService: MemberService = DIContainer.resolve<MemberService>(MemberService);

export const deleteFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
        }

        const id = event.pathParameters.id;

        const family = await familyService.GetFamilyById(id);

        if (!family) {
            return utilities.BuildResponse(404, JSON.stringify('Family not found'));
        }

        const members = await memberService.ListAllMembersByFamilyId(id);

        if (members) {
            await memberService.DeleteMemberList(members);
        }

        const deletedBoolean = await familyService.DeleteFamily(id);

        if (!deletedBoolean) {
            return utilities.BuildResponse(400, JSON.stringify('Failed to delete family'));
        }

        return utilities.BuildResponse(200, JSON.stringify('Successfully Deleted Family'));
    } catch (err) {
        console.error('Family Service Delete a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

export const deleteMemberFromFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
        }

        if (!event || !event.pathParameters || !event.pathParameters.familyId) {
            return utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
        }

        const id = event.pathParameters.id;
        const familyId = event.pathParameters.familyId

        const member = await memberService.GetMemberById(id);

        if (!member) {
            return utilities.BuildResponse(404, JSON.stringify('id for member not valid'));
        }

        const family = await familyService.GetFamilyById(familyId);

        if (!family) {
            return utilities.BuildResponse(404, JSON.stringify('familyId not valid'));
        }

        const memberDeleted = await memberService.DeleteMember(member);

        if (!memberDeleted) {
            return utilities.BuildResponse(400, JSON.stringify('Failed to delete member'));
        }

        return utilities.BuildResponse(200, JSON.stringify('Successfully Deleted member from family'));
    } catch (err) {
        console.error('Family Service Delete a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

export const deleteMember = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
        }

        const id = event.pathParameters.id;

        const members = await memberService.ListAllMembers(id);

        if (!members) {
            return utilities.BuildResponse(404, JSON.stringify('id for member not valid'));
        }

        const memberDeleted = await memberService.DeleteMemberList(members);

        if (!memberDeleted) {
            return utilities.BuildResponse(400, JSON.stringify('Failed to delete member'));
        }

        return utilities.BuildResponse(200, JSON.stringify('Successfully Deleted member from family'));
    } catch (err) {
        console.error('Family Service Delete a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

