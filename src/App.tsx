import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DocsPage } from "./DocsPage";
import { HomePage } from "./HomePage";
import { RedirectFrom404 } from "./RedirectFrom404";
import { SiteLayout } from "./SiteLayout";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function DocsLayout() {
  return (
    <SiteLayout>
      <DocsPage />
    </SiteLayout>
  );
}

export function App() {
  return (
    <BrowserRouter basename={basename === "/" ? undefined : basename}>
      <RedirectFrom404 />
      <Routes>
        <Route
          path="/"
          element={
            <SiteLayout>
              <HomePage />
            </SiteLayout>
          }
        />
        <Route path="/docs" element={<Navigate to="/docs/api" replace />} />
        <Route path="/docs/api" element={<DocsLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
