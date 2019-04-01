import iPostCategory from "../imodels/iPostCategory";

export default class PostCategory implements iPostCategory
{
  name : string;
  slug : string;
  posts : number;

  constructor(name : string, slug : string = "", posts : number = 0)
  {
    this.name = name;
    this.slug = slug ? slug : this.createSlugFromName(name);
    this.posts = posts;
  }

  get data()
  {
    return {
      name: this.name,
      slug: this.slug,
      posts: this.posts
    }
  }

  public increasePosts(by : number = 1) { this.posts = this.posts + by }

  public decreasePost(by : number = 1) { this.posts = this.posts - by; }

  public createSlugFromName(name : string) : string
  {
    this.slug = name.toLowerCase().split(" ").join("-");
    return this.slug;
  }
}