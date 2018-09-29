import validateEmail from '../utilities/validateEmail';
import { MapDiscriminatedUnion } from './MapDiscriminatedUnion';

type EmailMatchOptions<TReturn> = MapDiscriminatedUnion<Email, 'key', TReturn>;

export type Email = InvalidEmail
| ValidEmail
| InitialEmail;

export function matchEmail<TReturn>(email : Email, options: EmailMatchOptions<TReturn>) {
    switch(email.key) {
        case "Initial":
            return options.Initial(email);
        case "Invalid":
            return options.Invalid(email);
        case "Valid":
            return options.Valid(email);
    }
}

export class InvalidEmail {
    public readonly key = 'Invalid';

    constructor(public readonly address: string, public readonly errors: string[]) { }
};

export class InitialEmail {
    public readonly key = 'Initial';
    public readonly address = '';
};

export class ValidEmail {
    public static create(possibleEmail : string) : Email {
        return validateEmail(possibleEmail)
            .matchWith<Email>({
                Failure: errors => new InvalidEmail(possibleEmail, errors.value),
                Success: () => new ValidEmail(possibleEmail),
            });
    }  

    public readonly key = 'Valid';
    private constructor(public readonly address : string) { }
}
