import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Navbar } from "./components/Navbar";

// Renders a page component to a full HTML document, on the server, in
// the same process that loaded the data. The browser receives finished
// HTML — there is no client bundle and nothing is fetched afterwards.
export function renderDocument(location: string, page: ReactElement): string {
  const body = renderToString(
    <StaticRouter location={location}>
      <Navbar />
      {page}
    </StaticRouter>
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Golden Voice</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&family=Tajawal:wght@500;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/global.css" />
  </head>
  <body>${body}</body>
</html>`;
}
