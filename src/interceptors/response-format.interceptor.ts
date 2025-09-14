import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, timestamp } from "rxjs";


@Injectable()
export class ReponseFormatInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse();

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message: "عملیات با موفقیت انجام شد",
                    data,
                    timestamp: new Date().toString()
                }
            })
        );
    }
}