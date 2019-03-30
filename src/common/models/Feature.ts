import iFeature from "../imodels/iFeature";
import iPost from "../imodels/iPost";
import Post from "../models/Post";
import Student from "../models/Student";

export default class Feature extends Post implements iFeature 
{
  Student : Student;
  isFeature : boolean;
  isActive? : boolean;
  expiration : Date;

  constructor(Post : Post, Student : Student, expiration : Date, isActive : boolean = true)
  {
    super(Post.author, Post.getPostData());

    this.Student = Student;
    this.isFeature = true;
    this.category = {
      student_features: true
    };
    this.isActive = !!isActive;
    this.expiration = expiration;
  }

  public getFeatureData(useCase: string = "display") : iPost | iFeature {
    const {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, isFeature, Student, expiration, hasHero,
      isActive
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt: useCase === "save" ? (<Date>createdAt).getTime() : createdAt, 
      category, state, conversations,
      likes, isFeature, Student, expiration, hasHero,
      isActive
    };
  }
}