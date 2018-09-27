import validateEmail from '../utilities/validateEmail';
import { IMatchable, MapDiscriminatedUnion } from './IMatchable';

export type Email = InvalidEmail
| ValidEmail
| InitialEmail;

type EmailMatchOptions<TReturn> = MapDiscriminatedUnion<Email, 'key', TReturn>;

export class InvalidEmail implements IMatchable<Email> {
    public readonly key = 'Invalid';

    constructor(public readonly address: string, public readonly errors: string[]) { }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) {
        return options.Invalid(this);
    }
};

export class InitialEmail implements IMatchable<Email> {
    public readonly key = 'Initial';
    public readonly address = '';

    public match<TReturn>(options : EmailMatchOptions<TReturn>) {
        return options.Initial(this);
    }
};

export class ValidEmail implements IMatchable<Email> {
    public static create(possibleEmail : string) : Email {
        return validateEmail(possibleEmail)
            .matchWith<Email>({
                Failure: errors => new InvalidEmail(possibleEmail, errors.value),
                Success: () => new ValidEmail(possibleEmail),
            });
    }  

    public readonly key = 'Valid';
    private constructor(public readonly address : string) { }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) {
        return options.Valid(this);
    }
}
