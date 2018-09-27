import { Email, ValidEmail } from "./Email";
import { IMatchable, MapDiscriminatedUnion } from "./IMatchable";
import { CompleteNameInformation, NameInformation } from './NameInformation';

type UserMatchOptions<TReturn> = MapDiscriminatedUnion<User, 'key', TReturn>;

export type User = IncompleteUser | CompleteUser | SavedUser; 

export class IncompleteUser implements IMatchable<User> {
    public readonly key = 'Incomplete';

    constructor(public readonly name: NameInformation,
        public readonly email: Email) { }

    public match<TReturn>(options : UserMatchOptions<TReturn>) {
        return options.Incomplete(this);
    }
}

export class CompleteUser implements IMatchable<User> {
    public static create(nameInformation : NameInformation, email : Email) : User {
        return email.match({
            Initial: (initialEmail) => new IncompleteUser(nameInformation, initialEmail),
            Invalid: (invalidEmail) => new IncompleteUser(nameInformation, invalidEmail),
            Valid: validEmail => nameInformation.match<User>({
                Complete: completeName => new CompleteUser(completeName, validEmail),
                Incomplete: incompleteName => new IncompleteUser(incompleteName, validEmail),
            }),
        })
    }

    public readonly key = 'Complete';

    private constructor(public readonly name: CompleteNameInformation,
        public readonly email: ValidEmail) { }

    public match<TReturn>(options : UserMatchOptions<TReturn>) : TReturn {
        return options.Complete(this);
    }
}

export class SavedUser implements IMatchable<User> {
    public readonly key = 'Saved';

    public constructor(public readonly name: CompleteNameInformation,
        public readonly email: ValidEmail,
        public readonly userId: number) { }

    public match<TReturn>(options : UserMatchOptions<TReturn>) : TReturn {
        return options.Saved(this);
    }
}