import { redirect } from "@remix-run/react";
import { serialize } from "cookie";

export const action = () => {
    return redirect("/", {
        headers: {
            "Set-Cookie": serialize("username", null, { maxAge: 0, path: '/' })
        }
    });
}