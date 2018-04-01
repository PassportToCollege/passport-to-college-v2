// Main Routes
export const LANDING = { name: "Home", route: "/" };
export const ABOUT_US = { name: "About Us", route: "/about-us" };
export const SCHOLARS = { name: "Scholars", route: "/scholars" };
export const EVENTS = { name: "Events", route: "/events" };
export const STORIES = { name: "Stories", route: "/stories" };
export const CONTACT_US = { name: "Contact Us", route: "/contact-us" };

// Admin Routes
export const DASHBOARD = { name: "Dashboard", route: "/admin/dashboard" };
export const USERS = { name: "Users", route: "/admin/dashboard/users" };
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
export const BLOG_DASH = { name: "Blog", route: "/admin/dashboard/blog" };

// Student Application Routes
export const APPLY = { name: "Apply", route: "/apply" };
export const APPLY_PORTAL = { name: "Application Portal", route: "/apply/p/:application_id" };

// Auth Routes
export const SIGN_IN = { name: "Sign In", route: "/auth/sign-in" };
export const SIGN_OUT = { name: "Sign Out", route: "/auth/sign-out" };
export const SIGN_UP = { name: "Sign Up", route: "/auth/sign-up/:temp_id" };
export const CONFIRM_EMAIL_ADDRESS = { name: "Confirm Email Address", route: "/auth/confirm-email-address/:uid" };
export const RESET_PASSWORD = { name: "Reset Password", route: "/auth/reset-password" };