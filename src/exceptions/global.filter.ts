import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request  = ctx.getRequest();
        const response = ctx.getResponse();

        let status  = 500;
        let message = "خطای مهمی رخ داده. با پشتیبانی تماس بگیرید!"

        if(exception instanceof HttpException){
            status = exception.getStatus();

            const exeptionResponse: any  = exception.getResponse();
            message = exeptionResponse.message || exeptionResponse;
        }else {
            message = exception.message;
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toString(),
            path: request.url
        })
    }
}