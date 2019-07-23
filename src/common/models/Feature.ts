import iFeature from '../imodels/iFeature';
import iPost from '../imodels/iPost';
import Post from '../models/Post';
import Student from '../models/Student';

export default class Feature extends Post implements iFeature 
{
  public Student: Student;
  public isFeature: boolean;
  public isActive?: boolean;
  public expiration: Date;

  constructor(post: Post, student: Student, expiration: Date, isActive: boolean = true) {
    super(post.author, post.getPostData());

    this.Student = student;
    this.isFeature = true;
    this.category = {
      student_features: true
    };
    this.isActive = !!isActive;
    this.expiration = expiration;
  }

  public getFeatureData(useCase: string = 'display'): iPost | iFeature {
    return {
      id: this.id, 
      title: this.title, 
      author: this.author, 
      excerpt: this.excerpt, 
      full: this.full,
      createdAt: useCase === 'save' ? (this.createdAt as Date).getTime() : this.createdAt, 
      category: this.category, 
      state: this.state, 
      conversations: this.conversations,
      likes: this.likes, 
      isFeature: this.isFeature, 
      Student: this.Student, 
      expiration: this.expiration, 
      hasHero: this.hasHero,
      isActive: this.isActive
    };
  }
}