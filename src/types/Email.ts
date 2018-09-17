import { validation, Validation } from 'folktale';

// type EmailIJustMadeUp = { address: string, key: 'Test' };

export type Email = InvalidEmail
| ValidEmail
| InitialEmail
// | EmailIJustMadeUp;

type ReturnFunction<TInput, TReturn> = (param : TInput) => TReturn;

type DiscriminateUnion<T, K extends keyof T, V extends T[K], TReturn> = 
  T extends Record<K, V> ? ReturnFunction<T, TReturn> : never

type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T, TReturn> =
  { [V in T[K]]: DiscriminateUnion<T, K, V, TReturn> };

type EmailMatchOptions<TReturn> = MapDiscriminatedUnion<Email, 'key', TReturn>;

// type EmailMatchOptions<TReturn> = {
//     Initial: (initialEmail: InitialEmail) => TReturn,
//     Incomplete: (initialEmail: InvalidEmail) => TReturn,
//     Valid: (initialEmail: ValidEmail) => TReturn,
// };

export function matchEmail<TReturn>(email : Email, options : EmailMatchOptions<TReturn>) : TReturn {
    switch (email.key) {
        case 'Incomplete':
            return options.Incomplete(email);
        case 'Initial':
            return options.Initial(email);
        case 'Valid':
            return options.Valid(email);
    }
}

abstract class EmailBase {
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
    protected abstract key : string;

    constructor(address: string) {
        this.address = address;
    }
    
    public abstract match<TReturn>(options : EmailMatchOptions<TReturn>) : TReturn;
}

export class InvalidEmail extends EmailBase {
    public readonly errors : string[];
    public readonly key = 'Incomplete';

    constructor(address: string, errors: string[]) {
        super(address);
        this.errors = errors;
    }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) : TReturn {
        return matchEmail(this, options);
    }

};
export class InitialEmail extends EmailBase {
    public readonly key = 'Initial';

    constructor() {
        super('');
    }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) : TReturn {
        return matchEmail(this, options);
    }
};

export class ValidEmail extends EmailBase {
    public static create(possibleEmail : string) : Email {
        return this.validateEmail(possibleEmail)
            .matchWith<Email>({
                Failure: errors => new InvalidEmail(possibleEmail, errors.value),
                Success: () => new ValidEmail(possibleEmail),
            });
    }  

    public readonly key = 'Valid';
    public readonly address: string;
    
    private constructor(email: string) {
        super(email);
        this.address = email;
    }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) : TReturn {
        return matchEmail(this, options);
    }
}