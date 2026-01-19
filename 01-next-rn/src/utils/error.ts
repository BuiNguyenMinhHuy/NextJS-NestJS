import { AuthError } from "next-auth";
export class CustomError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();
        this.type = message;
    }
}

export class InvalidEmailPasswordError extends AuthError {

    static type = "InvalidEmailError";
}
export class InactiveAccountError extends AuthError {

    static type = "InactiveAccountError";
}