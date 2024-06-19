import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import "./tailwind.css";

export const meta = () => {
  return [
    { title: "Pokédex" },
    { name: "description", content: "Gotta Catch 'Em All!" },
  ];
};

export default function App() {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
}