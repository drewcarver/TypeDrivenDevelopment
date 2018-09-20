import validateEmail from '../utilities/validateEmail';
import MatchableBase, { MapDiscriminatedUnion } from './MatchableBase';
// type EmailIJustMadeUp = { address: string, key: 'Test' };

export type Email = InvalidEmail
| ValidEmail
| InitialEmail;
// | EmailIJustMadeUp;

type EmailMatchOptions<TReturn> = MapDiscriminatedUnion<Email, 'key', TReturn>;

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
