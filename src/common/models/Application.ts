import iApplication, {
  EducationLevel,
  IncomeLevel,
  Interest,
  WorkEthic,
  USTest
} from "../imodels/iApplication";
import iContentEditable from "../imodels/iContentEditable";
import User from "./User";

export default class Application implements iApplication {
  User : User;
  uid : string;
  state : any;
  essay?: iContentEditable;
  educationLevel?: EducationLevel;
  gpa?: number;
  income?: IncomeLevel;
  interest?: Interest;
  score?: number;
  startedOn?: Date;
  usTest?: USTest;
  tests?: any;
  workEthic?: WorkEthic;
  lastSchool?: string;

  constructor(user : User, applicationData : any) {
    this.User = user;
    this.uid = user._uid;

    this.state = {
      draft : true,
      accepted : false,
      rejected : false,
      pending : false
    };
    this.essay = {
      blocks : [],
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
    this.lastSchool = "";

    if (Object.keys(applicationData).length) {
      Object.assign(this, applicationData);
    }
  }

  public getApplicationData(useCase : string = "display") : any {
    const {
      User,
      uid,
      state,
      essay,
      educationLevel,
      gpa,
      income,
      interest,
      score,
      startedOn,
      usTest,
      tests,
      workEthic,
      lastSchool
    } = this;

    return {
      User,
      uid,
      state,
      essay,
      educationLevel,
      gpa,
      income,
      interest,
      score,
      startedOn : (useCase == "save" && startedOn) ? startedOn.getTime() : startedOn,
      usTest,
      tests,
      workEthic,
      lastSchool
    };
  }
}