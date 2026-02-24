export const AUTH_USER_REGISTERED_EVENT = 'auth.user.registered';
export class UserRegisteredEvent {
    static eventName = AUTH_USER_REGISTERED_EVENT;
    static create(payload: any){
        return {
            name: this.eventName,
            payload
        }
    }
}