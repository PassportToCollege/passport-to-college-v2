interface ApplicationStats {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
  draft: number;
}

interface PostStats {
  total: number;
  archived: number;
  published: number;
  draft: number;
}

interface UserStats {
  total: number;
  admins: number;
  applicants: number;
  staff: number;
  students: number;
}

export default interface iStats {
  application: ApplicationStats;
  posts: PostStats;
  users: UserStats;
}