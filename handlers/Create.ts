import 'reflect-metadata';
import * as sourceMaps from 'source-map-support';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { inject } from 'inversify';
sourceMaps.install();

import DIContainer from '../di-container';
import { utilities } from './utilities';
import { FamilyService } from '../services/FamilyService';
import { MemberService } from '../services/MemberService';

export class CreateHandler {
    private _familyService: FamilyService;
    private _memberService: MemberService;

    constructor(@inject(FamilyService) familyService?: FamilyService, @inject(MemberService) memberService?: MemberService) {
        this._familyService = familyService || DIContainer.resolve<FamilyService>(FamilyService);
        this._memberService = memberService || DIContainer.resolve<MemberService>(MemberService);
    }

    public async CreateFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event.body) {
                return utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
            }
            const familyData = JSON.parse(event.body);
            const familyServerReturn = await this._familyService.createFamily(familyData);
    
            if (!familyServerReturn) {
                return utilities.BuildResponse(404, JSON.stringify('Failed to create Family'));
            }
    
            return utilities.BuildResponse(201, JSON.stringify(familyServerReturn));
        } catch(err) {
            console.error('Family Service Create a family error: ', err);
            return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async CreateMember(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event.body) {
                return utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
            }
            const memberData = JSON.parse(event.body);
            const memberServerReturn = await this._memberService.createMember(memberData);
    
            if (!memberServerReturn) {
                return utilities.BuildResponse(404, JSON.stringify('Failed to create Member'));
            }
    
            return utilities.BuildResponse(201, JSON.stringify(memberServerReturn));
        } catch(err) {
            console.error('Family Service Create a member error: ', err);
            return utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }
}

export const invokeCreateHandler = new CreateHandler();
export const createFamily = invokeCreateHandler.CreateFamily.bind(invokeCreateHandler);
export const createMember = invokeCreateHandler.CreateMember.bind(invokeCreateHandler);
