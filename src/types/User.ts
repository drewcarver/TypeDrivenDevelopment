import { Email, matchEmail, ValidEmail } from "./Email";
import { MapDiscriminatedUnion } from "./MapDiscriminatedUnion";
import { CompleteNameInformation, matchName, NameInformation } from './NameInformation';
import { matchPassword, Password, ValidPassword } from "./Password";

type UserMatchOptions<TReturn> = MapDiscriminatedUnion<User, 'key', TReturn>;

export type User = IncompleteUser | CompleteUser | SavedUser; 

export function matchUser<TReturn>(user : User, options : UserMatchOptions<TReturn>) {
    switch (user.key) {
        case "Complete":
            return options.Complete(user);
        case "Incomplete":
            return options.Incomplete(user);
        case "Saved":
            return options.Saved(user);
    }
}

export class IncompleteUser { 
    public readonly key = 'Incomplete';

    constructor(public readonly name: NameInformation,
        public readonly email: Email,
        public readonly password: Password) { }
}

export class CompleteUser {
    public static create(nameInformation : NameInformation, email : Email, password: Password) : User {
        return matchEmail(email, {
            Initial: (initialEmail) => new IncompleteUser(nameInformation, initialEmail, password),
            Invalid: (invalidEmail) => new IncompleteUser(nameInformation, invalidEmail, password),
            Valid: validEmail => matchName<User>(nameInformation, {
                Complete: completeName => matchPassword<User>(password, {
                  EmptyPassword: emptyPassword => new IncompleteUser(completeName, validEmail, emptyPassword),
                  InvalidPassword: invalidPassword => new IncompleteUser(completeName, validEmail, invalidPassword),
                  ValidPassword: validPassword => new CompleteUser(completeName, validEmail, validPassword),
                }), 
                Incomplete: incompleteName => new IncompleteUser(incompleteName, validEmail, password),
            }),
        })
    }

    public readonly key = 'Complete';

    private constructor(public readonly name: CompleteNameInformation,
        public readonly email: ValidEmail, public readonly password: ValidPassword) { }
}

export class SavedUser {
    public readonly key = 'Saved';

    public constructor(public readonly name: CompleteNameInformation,
        public readonly email: ValidEmail,
        public readonly password: ValidPassword,
        public readonly userId: number) { }
}