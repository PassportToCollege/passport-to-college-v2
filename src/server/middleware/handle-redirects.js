import * as routes from "../../common/constants/routes";
import Renderer from "./renderer";

export default (context, req, res, markup) => {
  if (context.url) {
    let { ssid } = req.cookies;
    const { url } = req;

    if (ssid === undefined)
      return res.redirect(context.url);

    ssid = JSON.parse(ssid);

    if (url.indexOf(routes.DASHBOARD.route) > -1) {
      if (ssid.isAdmin)
        return Renderer(req, res, markup);

      if (ssid.isApplicant)
        return res.redirect(`/apply/p/${ssid.uid}`);

      if (ssid.isStudent)
        return res.redirect(routes.STUDENT_DASHBOARD.route)
    }

    if (url.indexOf(routes.APPLY.route) > -1) {
      if (ssid.isApplicant)
        return Renderer(req, res, markup);

      if (ssid.isAdmin)
        return res.redirect(routes.DASHBOARD.route);
      
      if (ssid.isStudent)
        return res.redirect(routes.STUDENT_DASHBOARD.route)
    }

    if (url.indexOf(routes.STUDENT_DASHBOARD.route) > -1) {
      if (ssid.isStudent)
        return Renderer(req, res, markup);

      if (ssid.isAdmin)
        return res.redirect(routes.DASHBOARD.route);

      if (ssid.isApplicant)
        return res.redirect(`/apply/p/${ssid.uid}`);
    }
    
    return res.redirect(routes.LANDING.route);
  }

  Renderer(req, res, markup);
}