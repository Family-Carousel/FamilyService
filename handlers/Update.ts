import 'reflect-metadata';
import * as sourceMaps from 'source-map-support';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda';
import { inject } from 'inversify';
sourceMaps.install();


import DIContainer from '../di-container';
import { Utilities } from './utilities';
import { FamilyService } from '../services/FamilyService';
import { MemberService } from '../services/MemberService';
import { CalendarService } from '../services/CalendarService';

export class UpdateHandler {
    private _familyService: FamilyService;
    private _memberService: MemberService;
    private _calendarService: CalendarService

    constructor(@inject(FamilyService) familyService?: FamilyService, @inject(MemberService) memberService?: MemberService, 
    @inject(CalendarService) calendarService?: CalendarService) {
        this._familyService = familyService || DIContainer.resolve<FamilyService>(FamilyService);
        this._memberService = memberService || DIContainer.resolve<MemberService>(MemberService);
        this._calendarService = calendarService || DIContainer.resolve<CalendarService>(CalendarService);
    }

    public async UpdateFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
            }
    
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
            }
    
            const id = event.pathParameters.id;
            let newFamilyData = JSON.parse(event.body);
    
    
            if (id !== newFamilyData.Id ) {
                return Utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
            }
    
            let currentFamily = await this._familyService.GetFamilyById(id);
    
            if (!currentFamily) {
                return Utilities.BuildResponse(404, JSON.stringify('Family does not exist. Is your Id wrong?'));
            }
    
            const updatedFamily = await this._familyService.UpdateFamily(currentFamily, newFamilyData);
    
            if (!updatedFamily) {
                return Utilities.BuildResponse(404, JSON.stringify('Family update not successful'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(updatedFamily));
        } catch (err) {
            console.error('Family Service family update failure: ' + err);
            return Utilities.BuildResponse(500, 'Family Service family update failure');
        }
    }

    public async UpdateMemberForFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
            }
    
            if (!event.pathParameters.familyId) {
                return Utilities.BuildResponse(400, JSON.stringify('familyId is required in path to perform update'));
            }
    
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
            }
    
            const id = event.pathParameters.id;
            const familyId = event.pathParameters.familyId
            let newMemberData = JSON.parse(event.body);
    
            if (familyId !== newMemberData.FamilyId ) {
                return Utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match familyId in Path'));
            }
    
            if (id !== newMemberData.Id ) {
                return Utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
            }
    
            let currentMember = await this._memberService.GetMemberByCompositKey(id, familyId);
    
            if (!currentMember) {
                return Utilities.BuildResponse(404, JSON.stringify('Member does not exist. Is your Id wrong?'));
            }
    
            const updatedMember = await this._memberService.UpdateMemberForFamily(currentMember, newMemberData);
    
            if (!updatedMember) {
                return Utilities.BuildResponse(404, JSON.stringify('Member update not successful'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(updatedMember));
        } catch (err) {
            console.error('Family Service member update failure: ' + err);
            return Utilities.BuildResponse(500, 'Family Service member update failure');
        } 
    }

    public async UpdateCalendarEventForFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.familyId) {
                return Utilities.BuildResponse(400, JSON.stringify('familyId is required in path to perform update'));
            }
    
            if (!event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
            }
    
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
            }
    
            const id = event.pathParameters.id;
            const familyId = event.pathParameters.familyId
            let newEventData = JSON.parse(event.body);
    
            if (familyId !== newEventData.FamilyId ) {
                return Utilities.BuildResponse(400, JSON.stringify('Id mismatch. FamilyId in Body must match familyId in Path'));
            }
    
            if (id !== newEventData.Id ) {
                return Utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
            }
    
            let currentEvent = await this._calendarService.GetCalendarEventByCompositKey(familyId, id);
    
            if (!currentEvent) {
                return Utilities.BuildResponse(404, JSON.stringify('Calendar Event does not exist. Is your Id wrong?'));
            }
    
            const updatedEvent = await this._calendarService.UpdateCalenderEvent(currentEvent, newEventData);
    
            if (!updatedEvent) {
                return Utilities.BuildResponse(404, JSON.stringify('Calendar Event update not successful'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(updatedEvent));
        } catch (err) {
            console.error('Family Service Calendar Event update failure: ' + err);
            return Utilities.BuildResponse(500, 'Family Service Calendar Event update failure');
        } 
    }

    public async UpdateMemberGlobally(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('id is required in path to perform update'));
            }
    
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Update body must be included'));
            }
    
            const id = event.pathParameters.id;
            let newMemberData = JSON.parse(event.body);
    
            if (id !== newMemberData.Id ) {
                return Utilities.BuildResponse(400, JSON.stringify('Id mismatch. Id in Body must match id in Path'));
            }
    
            let currentMemberList = await this._memberService.ListAllMembers(id);
    
            if (!currentMemberList) {
                return Utilities.BuildResponse(404, JSON.stringify('Member does not exist. Is your Id wrong?'));
            }
    
            const updatedMember = await this._memberService.UpdateMemberGlobally(currentMemberList, newMemberData);
    
            if (!updatedMember) {
                return Utilities.BuildResponse(404, JSON.stringify('Member update not successful'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(updatedMember));
        } catch (err) {
            console.error('Family Service member update failure: ' + err);
            return Utilities.BuildResponse(500, 'Family Service member update failure');
        }    
    }
}

export const invokeUpdateHandler = new UpdateHandler();
export const updateFamily = invokeUpdateHandler.UpdateFamily.bind(invokeUpdateHandler);
export const updateMemberForFamily = invokeUpdateHandler.UpdateMemberForFamily.bind(invokeUpdateHandler);
export const updateMemberGlobally = invokeUpdateHandler.UpdateMemberGlobally.bind(invokeUpdateHandler);
export const updateCalendarEventForFamily = invokeUpdateHandler.UpdateCalendarEventForFamily.bind(invokeUpdateHandler);
