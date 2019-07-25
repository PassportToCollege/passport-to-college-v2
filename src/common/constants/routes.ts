export interface PageRoute {
  name: string;
  route: string;
  dashLabel?: string;
  slug?: string;
}

// Main Routes
export const LANDING: PageRoute = { name: 'Home', route: '/' };
export const ABOUT_US: PageRoute = { name: 'About Us', route: '/about-us' };
export const SCHOLARS: PageRoute = { name: 'Scholars', route: '/scholars' };
export const SCHOLARS_PAST: PageRoute = { name: 'Past Scholars', route: '/scholars/past' };
export const SCHOLAR: PageRoute = { name: 'Scholar', route: '/scholars/view/scholar/:uid' };
export const EVENTS: PageRoute = { name: 'Events', route: '/events' };
export const STORIES: PageRoute = { name: 'Stories', route: '/stories' };
export const STORIES_CATEGORY: PageRoute = { name: 'Stories by Category', route: '/stories/cat/:category' };
export const STORY: PageRoute = { name: 'Story', route: '/stories/read/:post_id' };
export const COMMUNITY_GUIDLINES: PageRoute = { name: 'Community Guidlines', route: '/stories/community-guidlines' };
export const CONTACT_US: PageRoute = { name: 'Contact Us', route: '/contact-us' };
export const CONTACT_US_MESSAGE: PageRoute = { name: 'Send Message | Contact Us', route: '/contact-us/send-message' };

// Admin Routes
export const DASHBOARD: PageRoute = { name: 'Dashboard', route: '/admin/dashboard' };
export const USERS: PageRoute = { name: 'Users', route: '/admin/dashboard/users' };
export const USERS_CREATE: PageRoute = { name: 'Create user', route: '/admin/dashboard/users/create/new' };
export const USERS_BY_TYPE: PageRoute = { name: 'Users by type', route: '/admin/dashboard/users/:user_type' };
export const USERS_STUDENTS: PageRoute = { name: 'Students', route: '/admin/dashboard/users/students' };
export const USERS_ADMINS: PageRoute = { name: 'Admins', route: '/admin/dashboard/users/admins' };
export const USERS_APPLICANTS: PageRoute = { name: 'Applicants', route: '/admin/dashboard/users/applicants' };
export const USERS_STAFF: PageRoute = { name: 'Staff', route: '/admin/dashboard/users/staff' };
export const VIEW_USER: PageRoute = { name: 'View Application', route: '/admin/dashboard/users/view/:user_id' };
export const VIEW_USER_SECTIONS: PageRoute[] = [
  { name: 'Education', slug: 'education', route: '/education' },
  { name: 'Profile Picture', slug: 'profile-picture', route: '/profile-picture' },
  { name: 'Bio', slug: 'bio', route: '/bio' },
  { name: 'Accomplishments', slug: 'accomplishments', route: '/accomplishments' },
  { name: 'Features', slug: 'features', route: '/features' },
  { name: 'Settings', slug: 'settings', route: '/settings' }
];
export const APPLICATIONS: PageRoute = { name: 'Applications', route: '/admin/dashboard/applications' };
export const VIEW_APPLICATION: PageRoute = { 
  name: 'View Application', 
  route: '/admin/dashboard/applications/view/:application_id' 
};
export const VIEW_APPLICATION_SECTIONS: PageRoute[] = [
  { name: 'Tests', route: '/tests' },
  { name: 'Essay', route: '/essay' },
  { name: 'Decide', route: '/decide' }
];
export const PROFILE: PageRoute = { name: 'Profile', route: '/admin/dashboard/profile' };
export const PROFILE_SETTINGS: PageRoute = { name: 'Settings | Profile', route: '/admin/dashboard/profile/settings' };
export const POST_CATEGORIES: PageRoute = { name: 'Post categories', route: '/admin/dashboard/posts/categories' };
export const DASH_POSTS: PageRoute = { name: 'Posts', route: '/admin/dashboard/posts' };
export const DASH_POSTS_EDIT: PageRoute = { name: 'Edit post', route: '/admin/dashboard/posts/e/:post_id' };
export const DASH_POSTS_SECTIONS: PageRoute[] = [
  { name: 'All', route: '/admin/dashboard/posts' },
  { name: 'Archived', route: '/admin/dashboard/posts/archived' },
  { name: 'Published', route: '/admin/dashboard/posts/published' },
  { name: 'Draft', route: '/admin/dashboard/posts/draft' },
  { name: 'Settings', route: '/admin/dashboard/posts/settings' }
];
export const DASH_POSTS_COMMENTS: PageRoute = {
  name: 'Post comments',
  route: '/admin/dashboard/post/:post_id/comments'
};

// Student Dashboard Routes
export const STUDENT_DASHBOARD: PageRoute = { 
  name: 'Student Dashboard', 
  dashLabel: 'profile', 
  route: '/scholar/dashboard' 
};
export const STUDENT_DASHBOARD_BIO: PageRoute = { 
  name: 'Bio | Student Dashboard', 
  dashLabel: 'bio', 
  route: '/scholar/dashboard/bio' 
};
export const STUDENT_DASHBOARD_EDUCATION: PageRoute = { 
  name: 'Education | Student Dashboard', 
  dashLabel: 'education', 
  route: '/scholar/dashboard/education' 
};
export const STUDENT_DASHBOARD_SETTINGS: PageRoute = { 
  name: 'Settings | Student Dashboard', 
  dashLabel: 'settings', 
  route: '/scholar/dashboard/settings' 
};

// Student Application Routes
export const APPLY: PageRoute = { name: 'Apply', route: '/apply' };
export const APPLY_PORTAL: PageRoute = { name: 'Application Portal | Apply', route: '/apply/p/:application_id' };

// Auth Routes
export const SIGN_IN: PageRoute = { name: 'Sign In', route: '/auth/sign-in' };
export const SIGN_OUT: PageRoute = { name: 'Sign Out', route: '/auth/sign-out' };
export const SIGN_UP: PageRoute = { name: 'Sign Up', route: '/auth/sign-up/:temp_id' };
export const CONFIRM_EMAIL_ADDRESS: PageRoute = { 
  name: 'Confirm Email Address', 
  route: '/auth/confirm-email-address/:uid' 
};
export const RESET_PASSWORD: PageRoute = { name: 'Reset Password', route: '/auth/reset-password' };