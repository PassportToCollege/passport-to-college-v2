// Main Routes
export const LANDING = { name: "Home", route: "/" };
export const ABOUT_US = { name: "About Us", route: "/about-us" };
export const SCHOLARS = { name: "Scholars", route: "/scholars" };
export const EVENTS = { name: "Events", route: "/events" };
export const STORIES = { name: "Stories", route: "/stories" };
export const STORIES_CATEGORY = { name: "Stories by Category", route: "/stories/cat/:category" };
export const STORY = { name: "Story", route: "/stories/read/:post_id" };
export const COMMUNITY_GUIDLINES = { name: "Community Guidlines", route: "/stories/community-guidlines" };
export const CONTACT_US = { name: "Contact Us", route: "/contact-us" };

// Admin Routes
export const DASHBOARD = { name: "Dashboard", route: "/admin/dashboard" };
export const USERS = { name: "Users", route: "/admin/dashboard/users" };
export const USERS_CREATE = { name: "Create user", route: "/admin/dashboard/users/create/new" };
export const USERS_BY_TYPE = { name: "Users by type", route: "/admin/dashboard/users/:user_type" };
export const USERS_STUDENTS = { name: "Students", route: "/admin/dashboard/users/students" };
export const USERS_ADMINS = { name: "Admins", route: "/admin/dashboard/users/admins" };
export const USERS_APPLICANTS = { name: "Applicants", route: "/admin/dashboard/users/applicants" };
export const USERS_STAFF = { name: "Staff", route: "/admin/dashboard/users/staff" };
export const VIEW_USER = { name: "View Application", route: "/admin/dashboard/users/view/:user_id" };
export const VIEW_USER_SECTIONS = [
  { name: "Education", slug: "education", route: "/education" },
  { name: "Profile Picture", slug: "profile-picture", route: "/profile-picture" },
  { name: "Bio", slug: "bio", route: "/bio" },
  { name: "Accomplishments", slug: "accomplishments", route: "/accomplishments" },
  { name: "Features", slug: "features", route: "/features" },
  { name: "Settings", slug: "settings", route: "/settings" }
];
export const APPLICATIONS = { name: "Applications", route: "/admin/dashboard/applications" };
export const VIEW_APPLICATION = { name: "View Application", route: "/admin/dashboard/applications/view/:application_id" };
export const VIEW_APPLICATION_SECTIONS = [
  { name: "Tests", route: "/tests" },
  { name: "Essay", route: "/essay" },
  { name: "Decide", route: "/decide" }
];
export const PROFILE = { name: "Profile", route: "/admin/dashboard/profile" };
export const POST_CATEGORIES = { name: "Post categories", route: "/admin/dashboard/posts/categories" };
export const DASH_POSTS = { name: "Posts", route: "/admin/dashboard/posts" };
export const DASH_POSTS_EDIT = { name: "Edit post", route: "/admin/dashboard/posts/e/:post_id" };
export const DASH_POSTS_SECTIONS = [
  { name: "All", route: "/admin/dashboard/posts" },
  { name: "Archived", route: "/admin/dashboard/posts/archived" },
  { name: "Published", route: "/admin/dashboard/posts/published" },
  { name: "Draft", route: "/admin/dashboard/posts/draft" },
  { name: "Settings", route: "/admin/dashboard/posts/settings" }
];
export const DASH_POSTS_COMMENTS = {
  name: "Post comments",
  route: "/admin/dashboard/post/:post_id/comments"
};

// Student Application Routes
export const APPLY = { name: "Apply", route: "/apply" };
export const APPLY_PORTAL = { name: "Application Portal | Apply", route: "/apply/p/:application_id" };

// Auth Routes
export const SIGN_IN = { name: "Sign In", route: "/auth/sign-in" };
export const SIGN_OUT = { name: "Sign Out", route: "/auth/sign-out" };
export const SIGN_UP = { name: "Sign Up", route: "/auth/sign-up/:temp_id" };
export const CONFIRM_EMAIL_ADDRESS = { name: "Confirm Email Address", route: "/auth/confirm-email-address/:uid" };
export const RESET_PASSWORD = { name: "Reset Password", route: "/auth/reset-password" };