import iApplication, {
  EducationLevel,
  IncomeLevel,
  Interest,
  WorkEthic,
  USTest,
  iApplicationState
} from '../imodels/iApplication';
import iContentEditable from '../imodels/iContentEditable';
import User from './User';
import { iStringTestPair } from '../imodels/iObjectTypes';

export default class Application implements iApplication {
  public User: User;
  public uid: string;
  public state: iApplicationState;
  public essay?: iContentEditable;
  public educationLevel?: EducationLevel;
  public gpa?: number;
  public income?: IncomeLevel;
  public interest?: Interest;
  public score?: number;
  public startedOn?: Date;
  public usTest?: USTest;
  public tests?: iStringTestPair;
  public workEthic?: WorkEthic;
  public lastSchool?: string;

  constructor(user: User, applicationData: any) {
    this.User = user;
    this.uid = user._uid;

    this.state = {
      draft: true,
      accepted: false,
      rejected: false,
      pending: false
    };
    this.essay = {
      blocks: [],
      entityMap: {}
    };
    this.educationLevel = EducationLevel.NoHighSchool;
    this.gpa = 0;
    this.income = IncomeLevel.Less10k;
    this.interest = Interest.Undecided;
    this.score = 0;
    this.startedOn = new Date();
    this.usTest = USTest.None;
    this.tests = {};
    this.workEthic = WorkEthic.Average;
    this.lastSchool = '';

    if (Object.keys(applicationData).length) {
      Object.assign(this, applicationData);
    }
  }

  public getApplicationData(useCase: string = 'display'): iApplication {
    return {
      User: this.User,
      uid: this.uid,
      state: this.state,
      essay: this.essay,
      educationLevel: this.educationLevel,
      gpa: this.gpa,
      income: this.income,
      interest: this.interest,
      score: this.score,
      startedOn: (useCase === 'save' && this.startedOn) ? this.startedOn.getTime() : this.startedOn,
      usTest: this.usTest,
      tests: this.tests,
      workEthic: this.workEthic,
      lastSchool: this.lastSchool
    };
  }
}