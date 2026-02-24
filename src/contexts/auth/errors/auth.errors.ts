import { DomainError } from "src/core/errors/domain-error";

export class PlayerNotFoundError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "PLAYER_NOT_FOUND",
            message: "Player not found",
            statusCode: 404,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}

export class EmailAlreadyInUseError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "EMAIL_ALREADY_IN_USE",
            message: "Email already in use",
            statusCode: 400,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}

export class InvalidCredentialsError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "INVALID_CREDENTIALS",
            message: "Invalid credentials",
            statusCode: 401,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}

export class InvalidPasswordError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "INVALID_PASSWORD",
            message: "Invalid password",
            statusCode: 400,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}

export class UserNotFoundError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "USER_NOT_FOUND",
            message: "User not found",
            statusCode: 404,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}

export class InvalidPermissionMaskError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "INVALID_PERMISSION_MASK",
            message: "Invalid permission mask",
            statusCode: 400,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}

export class InvalidRoleError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "INVALID_ROLE",
            message: "Invalid role",
            statusCode: 400,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}