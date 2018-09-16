import { validation, Validation } from 'folktale';
import * as R from 'ramda';

export type User = {
    firstName: string,
    lastName: string,
    email: Email,
};

type EmailMatchOptions<TReturn> = {
    Initial: (initialEmail: InitialEmail) => TReturn,
    Incomplete: (initialEmail: InvalidEmail) => TReturn,
    Valid: (initialEmail: ValidEmail) => TReturn,
};

abstract class Email {
    protected static validateEmail(email: string) : Validation<string[], string> {
        return validation.Success<string[], string>(email)
            .concat(this.isMissingAtSign(email))
            .concat(this.isMissingDomain(email))
            .concat(this.doesntPassEmailRegex(email));
    }

    private static isMissingAtSign(email : string): Validation<string[], string> { 
        return email.includes('@')
            ? validation.Success(email) 
            : validation.Failure(['Missing @ symbol.']);
    }

    private static isMissingDomain(email : string): Validation<string[], string> { 
        return email.includes('.')
            ? validation.Success(email) 
            : validation.Failure(['Missing domain.']);
    }

    private static doesntPassEmailRegex(email : string) : Validation<string[], string> {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
        return emailRegex.test(email)
            ? validation.Success(email)
            : validation.Failure(['Doesnt pass the email regex']);
    } 

    public readonly address: string;

    constructor(address: string) {
        this.address = address;
    }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) : TReturn {
        return R.cond([
            [R.always(this instanceof ValidEmail), options.Valid],
            [R.always(this instanceof InvalidEmail), options.Incomplete],
            [R.always(this instanceof InitialEmail), options.Initial],
        ])(this);
    }
}

export class InvalidEmail extends Email {
    public readonly errors : string[];

    constructor(address: string, errors: string[]) {
        super(address);
        this.errors = errors;
    }
};
export class InitialEmail extends Email { 
    constructor() {
        super('');
    }
};

export class ValidEmail extends Email {
    public static create(possibleEmail : string) : Email {
        return this.validateEmail(possibleEmail)
            .matchWith({
                Failure: errors => new InvalidEmail(possibleEmail, errors.value),
                Success: () => new ValidEmail(possibleEmail),
            });
    }  

    public readonly address: string;
    
    private constructor(email: string) {
        super(email);
        this.address = email;
    }

}