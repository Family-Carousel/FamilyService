import { IRule } from '../interfaces/IRule';
import { IFamily } from '../interfaces/IFamily';
import { Rule } from '../models/Rule';
import { RuleRepo } from '../dataSources/rule-repository';
import { caseTsJsonValidator } from '../schemas/ruleSchema';
import { inject, injectable } from 'inversify';

@injectable()
export class CalendarService {
    protected _ruleRepo: RuleRepo;

    constructor(@inject(RuleRepo) ruleRepo: RuleRepo) {
        this._ruleRepo = ruleRepo;
    }

    public async createRulet(ruleData: IRule): Promise<IRule> {
        const newEvent = new Rule(ruleData);

        try {
            let valid = caseTsJsonValidator(newEvent);

            if (!valid) {
                console.log('Creating Rule - Invalid Rule Format');
                throw new Error("Creating Rule - Invalid Rule Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on Rule data: ', err);
            throw new Error('Failed to perform validation on Rule data');
        }

        try {
            const response = await this._ruleRepo.SaveRule(newEvent);
            return response as IRule;
        } catch (err) {``
            console.error('Failed to save Rule to data table: ', err);
            throw new Error('Failed to save Rule to data table');
        }
    }

    public async GetRuleByCompositKey(familyId: string, id: string): Promise<IRule> {
        try {
            const event = await this._ruleRepo.GetRuleByCompositKey(id, familyId);
            return event as IRule;
        } catch (err) {
            console.error('Failed to get Rule by id: ', err);
            throw new Error('Failed to get Rule by id');
        }
    }

    public async MapRulesToFamily(family: IFamily): Promise<IFamily> {
        try {
            const events = await this._ruleRepo.ListRulesByFamilyId(family.Id);

            if (events && events.length > 0) {
                for (let e = 0; e <= events.length; e++) {
                    if (events[e]) {
                        family.Rules?.push(events[e] as IRule);
                    }
                }
            }

            return family;
        } catch (err) {
            console.error('Failed to map Rules to family: ', err);
            throw new Error('Failed to map Rules to family');
        }
    }

    public async DeleteRulesList(events: IRule[]): Promise<boolean> {
        try {
            for (let e = 0; e < events.length; e++) {
                await this._ruleRepo.DeleteRule(events[e].FamilyId, events[e].Id);
            }
            return true;
        } catch (err) {
            console.error('Failed to delete list of Rules: ', err);
            throw new Error('Failed to delete list of Rules');
        }
    }

    public async ListAllRulesByFamilyId(familyId: string): Promise<IRule[]> {
        try {
            const events = await this._ruleRepo.ListRulesByFamilyId(familyId);
            return events as IRule[];
        } catch (err) {
            console.error('Failed to get Rules by familyId: ', err);
            throw new Error('Failed to get Rules by familyId');
        }
    }

    public async DeleteRule(event: IRule): Promise<boolean> {
        try {
            await this._ruleRepo.DeleteRule(event.FamilyId, event.Id);
            return true;
        } catch (err) {
            console.error('Failed to delete Rule: ', err);
            throw new Error('Failed to delete Rule');
        }
    }

    public async UpdateRule(currentEvent: IRule, newEventData: IRule): Promise<IRule> {
        newEventData.CreateDateTime = currentEvent.CreateDateTime;
        newEventData.CreateBy = currentEvent.CreateBy;

        const updatedEvent = new Rule(newEventData);

        if (currentEvent === updatedEvent) {
            throw new Error('Update not needed, Current Matches new data');
        }

        try {
            let valid = caseTsJsonValidator(updatedEvent);

            if (!valid) {
                console.log('Updating Rule - Invalid Rule Format');
                throw new Error("Updating Rule - Invalid Rule Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on Rule data: ', err);
            throw new Error('Failed to perform validation on Rule data');
        }

        try {
            const response = await this._ruleRepo.SaveRule(updatedEvent);
            return response as IRule;
        } catch (err) {
            console.error('Failed to save Rule to data table: ', err);
            throw new Error('Failed to save Fule to data table');
        }
    }
};
