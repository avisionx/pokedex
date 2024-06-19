import {
    Outlet,
    json,
    redirect,
} from "@remix-run/react";
import { parse } from "cookie";

export const loader = async ({ request }) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    if (!cookies.username) {
        return redirect("/");
    }

    return json({});
};

export default function AuthenticatedLayout() {
    return <Outlet />
}