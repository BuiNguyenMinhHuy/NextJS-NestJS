'use server'
import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            //callbackUrl: "/",
            redirect: false,
        })
        console.log('>>>r:', r);
        return r;
    } catch (error) {
        if ((error as any).type === "InvalidEmailError") {
            return {
                error: (error as any).type,
                code: 1,
            };
        } else if ((error as any).type === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2,
            };
        } else {
            return {
                error: "Internal server error",
                code: 0,
            };
        }
        //return { "error": "Incorrect username or password" }
        //console.log("error:", JSON.stringify(error));
        // if (error.cause.err instanceof InvalidLoginError) {
        //     return {"error": "Incorrect username or password"}
        // } else {
        //     throw new Error("Failed to authenticate")
        // }
    }
}