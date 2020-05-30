import { Container } from 'inversify';
import { DynamoDB } from 'aws-sdk';

import { FamilyRepo } from './dataSources/family-repository';
import { MemberRepo } from './dataSources/member-repository';
import { CalendarRepo } from './dataSources/calendar-repository';

import { FamilyService } from './services/FamilyService';
import { MemberService } from './services/MemberService';
import { CalendarService } from './services/CalendarService';

import { DynamoUtilities } from './dataSources/dynamo.utilities';

var DIContainer = new Container();

DIContainer.bind<FamilyRepo>(FamilyRepo).toSelf();
DIContainer.bind<MemberRepo>(MemberRepo).toSelf();
DIContainer.bind<CalendarRepo>(CalendarRepo).toSelf();

DIContainer.bind<FamilyService>(FamilyService).toSelf();
DIContainer.bind<MemberService>(MemberService).toSelf();
DIContainer.bind<CalendarService>(CalendarService).toSelf();

DIContainer.bind<DynamoUtilities>(DynamoUtilities).toSelf();

DIContainer.bind<DynamoDB.DocumentClient>(DynamoDB.DocumentClient).toConstantValue(new DynamoDB.DocumentClient());

export default DIContainer;
