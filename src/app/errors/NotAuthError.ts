export class NotAuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotAuthError";
    }
}