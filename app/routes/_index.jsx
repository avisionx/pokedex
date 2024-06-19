import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { parse, serialize } from 'cookie';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';

const mockUser = {
    username: "admin",
    password: "admin"
};

export const loader = async ({ request }) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    if (cookies.username) {
        return redirect("/pokemons");
    }

    return json({});
};

export default function Login() {
    const actionData = useActionData();

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your username and password to login</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method="post" className="space-y-4">
                        <div>
                            <label htmlFor="username">Username</label>
                            <Input type="text" name="username" id="username" required />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <Input type="password" name="password" id="password" required />
                        </div>
                        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
                        <Button type="submit" className="w-full">Login</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
        return json({ error: "Invalid username or password!" }, { status: 400 });
    }

    // Make a DB call to verify the user here.
    if (username === mockUser.username && password === mockUser.password) {
        return redirect("/pokemons", {
            headers: {
                "Set-Cookie": serialize("username", username, { path: "/" })
            }
        });
    } else {
        return json({ error: "Invalid username or password!" }, { status: 401 });
    }
};