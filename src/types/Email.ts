import { validation, Validation } from 'folktale';
import MatchableBase, { MapDiscriminatedUnion } from './MatchableBase';
// type EmailIJustMadeUp = { address: string, key: 'Test' };

export type Email = InvalidEmail
| ValidEmail
| InitialEmail
// | EmailIJustMadeUp;

type EmailMatchOptions<TReturn> = MapDiscriminatedUnion<Email, 'key', TReturn>;

function validateEmail(email: string) : Validation<string[], string> {
    return validation.Success<string[], string>(email)
        .concat(isMissingAtSign(email))
        .concat(isMissingDomain(email))
        .concat(doesntPassEmailRegex(email));
}

function isMissingAtSign(email : string): Validation<string[], string> { 
    return email.includes('@')
        ? validation.Success(email) 
        : validation.Failure(['Missing @ symbol.']);
}

function isMissingDomain(email : string): Validation<string[], string> { 
    return email.includes('.')
        ? validation.Success(email) 
        : validation.Failure(['Missing domain.']);
}

function doesntPassEmailRegex(email : string) : Validation<string[], string> {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    return emailRegex.test(email)
        ? validation.Success(email)
        : validation.Failure(['Doesnt pass the email regex']);
}

export class InvalidEmail extends MatchableBase<Email, 'key'> {
    public readonly key = 'Invalid';

    constructor(public readonly address: string, public readonly errors: string[]) { super(); }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) {
        return options.Invalid(this);
    }
};
export class InitialEmail extends MatchableBase<Email, 'key'> {
    public readonly key = 'Initial';
    public readonly address = '';

    public match<TReturn>(options : EmailMatchOptions<TReturn>) {
        return options.Initial(this);
    }
};

export class ValidEmail extends MatchableBase<Email, 'key'> {
    public static create(possibleEmail : string) : Email {
        return validateEmail(possibleEmail)
            .matchWith<Email>({
                Failure: errors => new InvalidEmail(possibleEmail, errors.value),
                Success: () => new ValidEmail(possibleEmail),
            });
    }  

    public readonly key = 'Valid';
    private constructor(public readonly address : string) { super(); }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) {
        return options.Valid(this);
    }
}
