import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HtppExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request  = ctx.getRequest();
        const response = ctx.getResponse();

        const status   = exception.getStatus();
        const exeptionResponse: any  = exception.getResponse();
        const message = exeptionResponse.message || exeptionResponse;

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toString(),
            path: request.url
        })
    }
}