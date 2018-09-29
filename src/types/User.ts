import { Email, matchEmail, ValidEmail } from "./Email";
import { MapDiscriminatedUnion } from "./MapDiscriminatedUnion";
import { CompleteNameInformation, matchName, NameInformation } from './NameInformation';

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
        public readonly email: Email) { }

    public match<TReturn>(options : UserMatchOptions<TReturn>) {
        return options.Incomplete(this);
    }
}

export class CompleteUser {
    public static create(nameInformation : NameInformation, email : Email) : User {
        return matchEmail(email, {
            Initial: (initialEmail) => new IncompleteUser(nameInformation, initialEmail),
            Invalid: (invalidEmail) => new IncompleteUser(nameInformation, invalidEmail),
            Valid: validEmail => matchName<User>(nameInformation, {
                Complete: completeName => new CompleteUser(completeName, validEmail),
                Incomplete: incompleteName => new IncompleteUser(incompleteName, validEmail),
            }),
        })
    }

    public readonly key = 'Complete';

    private constructor(public readonly name: CompleteNameInformation,
        public readonly email: ValidEmail) { }
}

export class SavedUser {
    public readonly key = 'Saved';

    public constructor(public readonly name: CompleteNameInformation,
        public readonly email: ValidEmail,
        public readonly userId: number) { }
}