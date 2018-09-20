import { Email, ValidEmail } from "./Email";
import MatchableBase, { MapDiscriminatedUnion } from "./MatchableBase";

type UserMatchOptions<TReturn> = MapDiscriminatedUnion<User, 'key', TReturn>;

export type User = IncompleteUser | CompleteUser | SavedUser; 

export class IncompleteUser extends MatchableBase<User, 'key'> {
    public readonly key = 'Incomplete';

    constructor(public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: Exclude<Email, ValidEmail>) { super(); }

    public match<TReturn>(options : UserMatchOptions<TReturn>) {
        return options.Incomplete(this);
    }
}

export class CompleteUser extends MatchableBase<User, 'key'> {
    public static create(firstName : string, lastName: string, email : Email) : User {
        return email.match<User>({
            Initial: (initialEmail) => new IncompleteUser(firstName, lastName, initialEmail),
            Invalid: (invalidEmail) => new IncompleteUser(firstName, lastName, invalidEmail),
            Valid: (validEmail) => new CompleteUser(firstName, lastName, validEmail)
        })
    }

    public readonly key = 'Complete';

    private constructor(public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: ValidEmail) { super(); }

    public match<TReturn>(options : UserMatchOptions<TReturn>) : TReturn {
        return options.Complete(this);
    }
}

export class SavedUser extends MatchableBase<User, 'key'> {
    public readonly key = 'Saved';

    public constructor(public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: ValidEmail,
        public readonly userId: number) { super(); }

    public match<TReturn>(options : UserMatchOptions<TReturn>) : TReturn {
        return options.Saved(this);
    }
}