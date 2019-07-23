import iPost from '../imodels/iPost';
import iAccomplishment from '../imodels/iAccomplishment';
import Post from '../models/Post';
import Student from '../models/Student';

export default class Accomplishment extends Post implements iAccomplishment {
  public student: Student;
  public isAccomplishment: boolean;

  constructor(post: Post, student: Student) {
    super(post.author, post.getPostData());

    this.student = student;
    this.isAccomplishment = true;
  }

  public getAccomplishmentData(useCase: string = 'display'): iPost | iAccomplishment {
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
      isAccomplishment: this.isAccomplishment, 
      student: this.student, 
      hasHero: this.hasHero
    };
  }
}