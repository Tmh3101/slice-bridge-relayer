import { ContentfulStatusCode } from 'hono/utils/http-status'

export class ErrorResponse {
    public status: ContentfulStatusCode;
    public message: string;
    public data: any;
    constructor(status: ContentfulStatusCode = 400, message: string = "error", data: any = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}