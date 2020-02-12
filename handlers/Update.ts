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

export const updateFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
        }

        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
        }

        const id = event.pathParameters.id;
        let newFamilyData = JSON.parse(event.body);


        if (id !== newFamilyData.Id ) {
            return utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
        }

        let currentFamily = await familyService.GetFamilyById(id);

        if (!currentFamily) {
            return utilities.BuildResponse(404, JSON.stringify('Family does not exist. Is your Id wrong?'));
        }

        const updatedFamily = await familyService.UpdateFamily(currentFamily, newFamilyData);

        if (!updatedFamily) {
            return utilities.BuildResponse(404, JSON.stringify('Family update not successful'));
        }

        return utilities.BuildResponse(200, JSON.stringify(updatedFamily));
    } catch (err) {
        console.error('Family Service family update failure: ' + err);
        return utilities.BuildResponse(500, 'Family Service family update failure');
    }
}

export const updateMemberForFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
        }

        if (!event.pathParameters.familyId) {
            return utilities.BuildResponse(400, JSON.stringify('familyId is required in path to perform update'));
        }

        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
        }

        const id = event.pathParameters.id;
        const familyId = event.pathParameters.familyId
        let newMemberData = JSON.parse(event.body);

        if (familyId !== newMemberData.FamilyId ) {
            return utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match familyId in Path'));
        }

        if (id !== newMemberData.Id ) {
            return utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
        }

        let currentMember = await memberService.GetMemberByCompositKey(id, familyId);

        if (!currentMember) {
            return utilities.BuildResponse(404, JSON.stringify('Member does not exist. Is your Id wrong?'));
        }

        const updatedMember = await memberService.UpdateMemberForFamily(currentMember, newMemberData);

        if (!updatedMember) {
            return utilities.BuildResponse(404, JSON.stringify('Member update not successful'));
        }

        return utilities.BuildResponse(200, JSON.stringify(updatedMember));
    } catch (err) {
        console.error('Family Service member update failure: ' + err);
        return utilities.BuildResponse(500, 'Family Service member update failure');
    }    
}

export const updateMemberGlobally = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event || !event.pathParameters || !event.pathParameters.id) {
            return utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
        }

        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
        }

        const id = event.pathParameters.id;
        let newMemberData = JSON.parse(event.body);

        if (id !== newMemberData.Id ) {
            return utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
        }

        let currentMemberList = await memberService.ListAllMembers(id);

        if (!currentMemberList) {
            return utilities.BuildResponse(404, JSON.stringify('Member does not exist. Is your Id wrong?'));
        }

        const updatedMember = await memberService.UpdateMemberGlobally(currentMemberList, newMemberData);

        if (!updatedMember) {
            return utilities.BuildResponse(404, JSON.stringify('Member update not successful'));
        }

        return utilities.BuildResponse(200, JSON.stringify(updatedMember));
    } catch (err) {
        console.error('Family Service member update failure: ' + err);
        return utilities.BuildResponse(500, 'Family Service member update failure');
    }    
}

