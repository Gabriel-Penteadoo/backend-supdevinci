export class DomainError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly fields?: Record<string, string[]>;
    public readonly details?: Record<string, any>;

    constructor(params: {
        code: string, 
        message: string, 
        statusCode: number, 
        fields?: Record<string, string[]>, 
        details?: Record<string, any>}) {
       super(params.message);
       this.code = params.code;
       this.statusCode = params.statusCode;
       this.fields = params.fields;
       this.details = params.details;

       Object.setPrototypeOf(this, new.target.prototype);
    }
}