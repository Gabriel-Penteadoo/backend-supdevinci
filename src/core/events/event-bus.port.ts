export const EVENT_BUS = Symbol('EVENT_BUS')

export interface EventBusPort {
    publish(event: any): Promise<void>
}