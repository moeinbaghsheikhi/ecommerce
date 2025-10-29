import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";


@Injectable()
export class FactorListener {
    @OnEvent('factor.create')
    handleFactorCreate(order: any){
        console.log("create factor for this order: ", order.id)
    }
}