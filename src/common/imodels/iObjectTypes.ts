import iTest from "./iTest";
import Reply from "../models/Reply";

export interface iStringBooleanPair
{
  [key : string] : boolean
}

export interface iStringTestPair
{
  [key : string] : iTest
}

export interface iStringReplyListPair
{
  [Key : string] : Reply[]
}