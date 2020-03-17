import 'reflect-metadata';
import * as sourceMaps from 'source-map-support';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { inject } from 'inversify';
sourceMaps.install();

import DIContainer from '../di-container';
import { Utilities } from './utilities';
import { FamilyService } from '../services/FamilyService';
import { MemberService } from '../services/MemberService';

export class DeleteHandler {
    private _familyService: FamilyService;
    private _memberService: MemberService;

    constructor(@inject(FamilyService) familyService?: FamilyService, @inject(MemberService) memberService?: MemberService) {
        this._familyService = familyService || DIContainer.resolve<FamilyService>(FamilyService);
        this._memberService = memberService || DIContainer.resolve<MemberService>(MemberService);
    }

    public async DeleteFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
            }
    
            const id = event.pathParameters.id;
    
            const family = await this._familyService.GetFamilyById(id);
    
            if (!family) {
                return Utilities.BuildResponse(404, JSON.stringify('Family not found'));
            }
    
            const members = await this._memberService.ListAllMembersByFamilyId(id);
    
            if (members) {
                await this._memberService.DeleteMemberList(members);
            }
    
            const deletedBoolean = await this._familyService.DeleteFamily(id);
    
            if (!deletedBoolean) {
                return Utilities.BuildResponse(400, JSON.stringify('Failed to delete family'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify('Successfully Deleted Family'));
        } catch (err) {
            console.error('Family Service Delete a family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async DeleteMemberFromFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
            }
    
            if (!event || !event.pathParameters || !event.pathParameters.familyId) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
            }
    
            const id = event.pathParameters.id;
            const familyId = event.pathParameters.familyId
    
            const member = await this._memberService.GetMemberById(id);
    
            if (!member) {
                return Utilities.BuildResponse(404, JSON.stringify('id for member not valid'));
            }
    
            const family = await this._familyService.GetFamilyById(familyId);
    
            if (!family) {
                return Utilities.BuildResponse(404, JSON.stringify('familyId not valid'));
            }
    
            const memberDeleted = await this._memberService.DeleteMember(member);
    
            if (!memberDeleted) {
                return Utilities.BuildResponse(400, JSON.stringify('Failed to delete member'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify('Successfully Deleted member from family'));
        } catch (err) {
            console.error('Family Service Delete a family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async DeleteMember(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
            }
    
            const id = event.pathParameters.id;
    
            const members = await this._memberService.ListAllMembers(id);
    
            if (!members) {
                return Utilities.BuildResponse(404, JSON.stringify('id for member not valid'));
            }
    
            const memberDeleted = await this._memberService.DeleteMemberList(members);
    
            if (!memberDeleted) {
                return Utilities.BuildResponse(400, JSON.stringify('Failed to delete member'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify('Successfully Deleted member from family'));
        } catch (err) {
            console.error('Family Service Delete a family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }
}

export const invokeDeleteHandler = new DeleteHandler();
export const deleteFamily = invokeDeleteHandler.DeleteFamily.bind(invokeDeleteHandler);
export const deleteMemberFromFamily = invokeDeleteHandler.DeleteMemberFromFamily.bind(invokeDeleteHandler);
export const deleteMember = invokeDeleteHandler.DeleteMember.bind(invokeDeleteHandler);
