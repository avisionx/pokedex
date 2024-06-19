import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import "./tailwind.css";

export default function App() {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
}