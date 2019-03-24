import iUser from "./iUser";
import iContentEditable from "./iContentEditable";

export enum EducationLevel {
  NoHighSchool = "no high school",
  HighSchool = "high school",
  SomeCollege = "college no degree",
  Associate = "associate",
  Bachelor = "bachelor",
  Graduate = "graduate",
}

export enum IncomeLevel {
  Less10k = 10000,
  Less35k = 34999,
  Less50k = 49999,
  Less75k = 74999,
  Less100k = 99999,
  less150k = 149999,
}

export enum Interest {
  Business = 0,
  Education = 1,
  Humanities = 2,
  STEM = 3,
  Undecided = 4,
}

export enum WorkEthic {
  BelowAverage = 0,
  Average = 1,
  Excellent = 2,
}

export enum USTest {
  None = 0,
  SAT = 1,
  ACT = 2,
}

export default interface iApplication {
  User : iUser;
  readonly uid : string;
  state : any;
  essay? : iContentEditable;
  educationLevel? : EducationLevel;
  gpa? : number;
  income? : IncomeLevel;
  interest? : Interest;
  score? : number;
  startedOn? : Date;
  usTest? : USTest;
  tests? : any;
  workEthic? : WorkEthic;
  lastSchool? : string;
}