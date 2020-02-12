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

export const createFamily = async (
    event: APIGatewayEvent,
): Promise<ProxyResult> => {
    try {
        if (!event.body) {
            return utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
        }
        const familyData = JSON.parse(event.body);
        const familyServerReturn = await familyService.createFamily(familyData);

        if (!familyServerReturn) {
            return utilities.BuildResponse(404, JSON.stringify('Failed to create Family'));
        }

        return utilities.BuildResponse(201, JSON.stringify(familyServerReturn));
    } catch(err) {
        console.error('Family Service Create a family error: ', err);
        return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
    }
}

export const createMember = async (
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
