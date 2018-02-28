// Main Routes
export const LANDING = { name: "Home", route: "/" };
export const ABOUT_US = { name: "About Us", route: "/about-us" };
export const SCHOLARS = { name: "Scholars", route: "/scholars" };
export const EVENTS = { name: "Events", route: "/events" };
export const STORIES = { name: "Stories", route: "/stories" };
export const CONTACT_US = { name: "Contact Us", route: "/contact-us" };

// Admin Routes
export const DASHBOARD = { name: "Dashboard", route: "/admin/dashboard" }
export const USERS = { name: "Users", route: "/admin/dashboard/users" }
export const APPLICATIONS = { name: "Applications", route: "/admin/dashboard/applications" }
export const PROFILE = { name: "Profile", route: "/admin/dashboard/profile" }

// Student Application Routes
export const APPLY = { name: "Apply", route: "/apply" };
export const APPLY_PORTAL = { name: "Application Portal", route: "/apply/p/:application_id" }

// Auth Routes
export const SIGN_IN = { name: "Sign In", route: "/auth/sign-in" };
export const SIGN_OUT = { name: "Sign Out", route: "/auth/sign-out" };
export const CONFIRM_EMAIL_ADDRESS = { name: "Confirm Email Address", route: "/auth/confirm-email-address/:uid" };
export const RESET_PASSWORD = { name: "Reset Password", route: "/auth/reset-password" };