import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): any {
        // befor
        const now = Date.now();
        // console.log("Before: " + new Date()); 

        return next.handle().pipe(
            // after
            tap(() => {
                // console.log("After: " + new Date());
                console.log(`Time proccess:  + ${Date.now() - now}ms`);
            })
        );
    }
}