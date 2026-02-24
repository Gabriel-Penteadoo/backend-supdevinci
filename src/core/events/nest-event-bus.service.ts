import { Injectable } from "@nestjs/common";
import { EventBusPort } from "./event-bus.port";
import { EventEmitter2 } from "@nestjs/event-emitter"
@Injectable()
export class NestEventBusService implements EventBusPort {
    constructor(private readonly emitter: EventEmitter2) {}
    async publish(event: any): Promise<void> {
        await this.emitter.emitAsync(event.name, event.payload);
    }
}