import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** GitHub Pages 404.html stores the path before loading the SPA shell. */
export function RedirectFrom404() {
  const navigate = useNavigate();
  useEffect(() => {
    const redirect = sessionStorage.getItem("steddy-spa-redirect");
    if (!redirect) {
      return;
    }
    sessionStorage.removeItem("steddy-spa-redirect");
    try {
      const url = new URL(redirect, window.location.origin);
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      let path = url.pathname;
      if (base && path.startsWith(base)) {
        path = path.slice(base.length) || "/";
      }
      navigate(`${path}${url.search}${url.hash}`, { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  return null;
}
