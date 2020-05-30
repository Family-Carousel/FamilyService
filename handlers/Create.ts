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

export class CreateHandler {
    private _familyService: FamilyService;
    private _memberService: MemberService;
    private _calendarService: CalendarService;

    constructor(@inject(FamilyService) familyService?: FamilyService, @inject(MemberService) memberService?: MemberService, 
    @inject(CalendarService) calendarService?: CalendarService) {
        this._familyService = familyService || DIContainer.resolve<FamilyService>(FamilyService);
        this._memberService = memberService || DIContainer.resolve<MemberService>(MemberService);
        this._calendarService = calendarService || DIContainer.resolve<CalendarService>(CalendarService);
    }

    public async CreateFamily(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
            }
            const familyData = JSON.parse(event.body);
            const familyServerReturn = await this._familyService.createFamily(familyData);

            if (!familyServerReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Failed to create Family'));
            }

            return Utilities.BuildResponse(201, JSON.stringify(familyServerReturn));
        } catch (err) {
            console.error('Family Service Create a family error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async CreateMember(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
            }
            const memberData = JSON.parse(event.body);
            const memberServerReturn = await this._memberService.createMember(memberData);

            if (!memberServerReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Failed to create Member'));
            }

            return Utilities.BuildResponse(201, JSON.stringify(memberServerReturn));
        } catch (err) {
            console.error('Family Service Create a member error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }

    public async CreateCalendarEvent(event: APIGatewayEvent): Promise<ProxyResult> {
        try {
            if (!event.body) {
                return Utilities.BuildResponse(400, JSON.stringify('Object to create was not provided'));
            }
            const eventData = JSON.parse(event.body);
            const eventReturn = await this._calendarService.createCalendarEvent(eventData);

            if (!eventReturn) {
                return Utilities.BuildResponse(404, JSON.stringify('Failed to create calendar event'));
            }

            return Utilities.BuildResponse(201, JSON.stringify(eventReturn));
        } catch (err) {
            console.error('Family Service Create event error: ', err);
            return Utilities.BuildResponse(500, JSON.stringify('Family Service internal server error'));
        }
    }
}

export const invokeCreateHandler = new CreateHandler();
export const createFamily = invokeCreateHandler.CreateFamily.bind(invokeCreateHandler);
export const createMember = invokeCreateHandler.CreateMember.bind(invokeCreateHandler);
export const createCalendarEvent = invokeCreateHandler.CreateCalendarEvent.bind(invokeCreateHandler);
