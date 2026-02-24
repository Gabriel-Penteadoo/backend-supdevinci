import { DomainError } from "src/core/errors/domain-error";

export class ConversationNotFoundError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params?: { fields: Record<string, string[]> }) {
        super({
            code: "CONVERSATION_NOT_FOUND",
            message: "Conversation not found",
            statusCode: 404,
            fields: {},
            details: {}
        });

        this.fields = params?.fields || {};
    }
}

export class ConversationUnauthorizedError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params?: { fields: Record<string, string[]> }) {
        super({
            code: "CONVERSATION_UNAUTHORIZED",
            message: "Unauthorized to access this conversation",
            statusCode: 403,
            fields: {},
            details: {}
        });

        this.fields = params?.fields || {};
    }
}

export class TokenNotFoundError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor() {
        super({
            code: "TOKEN_NOT_FOUND",
            message: "Token not found",
            statusCode: 404
        });

        this.fields = {};
    }
}

export class TokenInvalidError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor() {
        super({
            code: "TOKEN_INVALID",
            message: "Token invalid",
            statusCode: 401
        });

        this.fields = {};
    }
}

export class TokenExpiredError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor() {
        super({
            code: "TOKEN_EXPIRED",
            message: "Token expired",
            statusCode: 401,
            details: {}
        });

        this.fields = {};
    }
}