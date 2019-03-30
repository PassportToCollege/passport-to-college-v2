import iPost from "../imodels/iPost";
import iAccomplishment from "../imodels/iAccomplishment";
import Post from "../models/Post";
import Student from "../models/Student";

export default class Accomplishment extends Post implements iAccomplishment
{
  student : Student;
  isAccomplishment : boolean;

  constructor(post : Post, student : Student)
  {
    super(post.author, post.getPostData());

    this.student = student;
    this.isAccomplishment = true;
  }

  public getAccomplishmentData(useCase: string = "display") : iPost | iAccomplishment
  {
    const {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, isAccomplishment, student, hasHero
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt: useCase === "save" ? (<Date>createdAt).getTime() : createdAt, 
      category, state, conversations,
      likes, isAccomplishment, student, hasHero
    };
  }
}