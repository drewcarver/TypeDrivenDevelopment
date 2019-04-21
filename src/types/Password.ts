import validatePassword from 'src/utilities/validPassword';
import { MapDiscriminatedUnion } from './MapDiscriminatedUnion';

type PasswordMatchOptions<TReturn> = MapDiscriminatedUnion<Password, 'key', TReturn>;

export type Password = ValidPassword
| InvalidPassword
| EmptyPassword;

export function matchPassword<TReturn>(password: Password, options: PasswordMatchOptions<TReturn>) {
    switch(password.key) {
        case "EmptyPassword":
            return options.EmptyPassword(password);
        case "InvalidPassword":
            return options.InvalidPassword(password);
        case "ValidPassword":
            return options.ValidPassword(password);
    }
}

export class InvalidPassword {
    public readonly key = 'InvalidPassword';

    constructor(public readonly password: string, public readonly confirmPassword: string, public readonly errors: string[]) { }
};

export class EmptyPassword {
    public readonly key = 'EmptyPassword';
    public readonly password = '';
    public readonly confirmPassword = '';
};

export class ValidPassword {
    public static create(password: string, confirmPassword: string) : Password {
        return validatePassword({ originalPassword: password, confirmationPassword: confirmPassword})
            .matchWith<Password>({
                Failure: errors => new InvalidPassword(password, confirmPassword, errors.value),
                Success: validPassword => new ValidPassword(validPassword.value.originalPassword, validPassword.value.confirmationPassword)
            })
    }  

    public readonly key = 'ValidPassword';
    private constructor(public readonly password: string, public readonly confirmPassword: string) { }
}
