export default interface iPostCategory
{
  name: string;
  slug: string;
  posts: number;
  createSlugFromName(name: string): string;
}