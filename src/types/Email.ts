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

export class InvalidEmail {
    public readonly errors : string[];
    public readonly key = 'Incomplete';
    public readonly address : string;

    constructor(address: string, errors: string[]) {
        this.address = address;
        this.errors = errors;
    }

    public match<TReturn>(options : EmailMatchOptions<TReturn>) : TReturn {
        return matchEmail(this, options);
    }

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
    public readonly address: string;
    
    private constructor(email: string) {
        this.address = email;
    }
}