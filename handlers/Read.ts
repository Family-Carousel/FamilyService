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

export class ReadHandler {
    private _familyService: FamilyService;
    private _memberService: MemberService;
    private _calendarService: CalendarService;

    constructor(@inject(FamilyService) familyService?: FamilyService, @inject(MemberService) memberService?: MemberService, 
    @inject(CalendarService) calendarService?: CalendarService) {
        this._familyService = familyService || DIContainer.resolve<FamilyService>(FamilyService);
        this._memberService = memberService || DIContainer.resolve<MemberService>(MemberService);
        this._calendarService = calendarService || DIContainer.resolve<CalendarService>(CalendarService);
    }

    public async GetFamilyById(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
            }
    
            const id = event.pathParameters.id;
    
            const familyReturn = await this._familyService.GetFamilyById(id);
    
            if (!familyReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
            }
    
            const familyWithMembers = await this._memberService.MapMembersToFamily(familyReturn);

            const familyWithMembersAndCalendarEvents = await this._calendarService.MapCalendarEventsToFamily(familyWithMembers);
    
            return Utilities.BuildResponse(200, JSON.stringify(familyWithMembersAndCalendarEvents));
        } catch (err) {
            console.error('Family Service Get a family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async ListAllMembersForFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
            }
    
            const id = event.pathParameters.id;
            
            const memberReturn = await this._memberService.ListAllMembersByFamilyId(id);
    
            if (!memberReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Family has no members'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(memberReturn));
        } catch (err) {
            console.error('Family Service list all members in family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async ListAllCalendarEventsForFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for family was not provided'));
            }
    
            const familyId = event.pathParameters.id;
            
            const eventReturn = await this._calendarService.ListAllCalendarEventsByFamilyId(familyId);
    
            if (!eventReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Family has no calendar Events'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(eventReturn));
        } catch (err) {
            console.error('Family Service list all calendar events in family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async GetMemberById(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
            }
    
            const id = event.pathParameters.id;
    
            const memberReturn = await this._memberService.GetMemberById(id);
    
            if (!memberReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Member does not exist'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(memberReturn));
        } catch (err) {
            console.error('Family Service Get a member error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }
    
    public async ListAllFamilysForMember(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event || !event.pathParameters || !event.pathParameters.id) {
                return Utilities.BuildResponse(400, JSON.stringify('Id for member was not provided'));
            }
    
            const id = event.pathParameters.id;
    
            const response = await this._memberService.ListAllMembers(id);
    
            if (!response) {
                return Utilities.BuildResponse(404, JSON.stringify('No Members Found'));
            }
    
            const families = await this._familyService.ListFamilysForEachMember(response);
    
            if (!families) {
                return Utilities.BuildResponse(404, JSON.stringify('No Families Found Matching any members'));
            }
    
            const familyWithMembers = await this._memberService.MapMembersToFamilyList(families);
    
            if (!familyWithMembers) {
                return Utilities.BuildResponse(404, JSON.stringify('Family does not exist'));
            }
    
            return Utilities.BuildResponse(200, JSON.stringify(familyWithMembers));
        } catch (err) {
            console.error('Family Service Get a member error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }
}

export const invokeReadHandler = new ReadHandler();
export const getFamilyById = invokeReadHandler.GetFamilyById.bind(invokeReadHandler);
export const listAllMembersForFamily = invokeReadHandler.ListAllMembersForFamily.bind(invokeReadHandler);
export const getMemberById = invokeReadHandler.GetMemberById.bind(invokeReadHandler);
export const listAllFamilysForMember = invokeReadHandler.ListAllFamilysForMember.bind(invokeReadHandler);
export const listAllCalendarEventsForFamily = invokeReadHandler.ListAllCalendarEventsForFamily.bind(invokeReadHandler);
