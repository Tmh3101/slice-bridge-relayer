import { ContentfulStatusCode } from 'hono/utils/http-status'

export class SuccessResponse {
    public status: ContentfulStatusCode;
    public message: string;
    public data: any;
    constructor(status: ContentfulStatusCode = 200, message: string = "success", data: any = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export class CreatedResponse extends SuccessResponse {
    constructor(message: string = "resource created", data: any = null) {
        super(201, message, data);
    }
}