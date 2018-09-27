import { IMatchable, MapDiscriminatedUnion } from "./IMatchable";

export type NameInformation = CompleteNameInformation
| IncompleteNameInformation;

export class IncompleteNameInformation implements IMatchable<NameInformation> {
    public key = 'Incomplete';    

    public constructor(public readonly firstName: string, public readonly lastName: string) {}

    public match<TReturn>(options: MapDiscriminatedUnion<NameInformation, "key", TReturn>): TReturn {
        return options.Incomplete(this);
    }
}

export class CompleteNameInformation implements IMatchable<NameInformation> {
    public static create(firstName: string, lastName: string) {
        return firstName && lastName
            ? new CompleteNameInformation(firstName, lastName)
            : new IncompleteNameInformation(firstName, lastName);
    }
    public key = 'Complete';

    private constructor(public readonly firstName: string, public readonly lastName: string) {}
    public match<TReturn>(options: MapDiscriminatedUnion<NameInformation, 'key', TReturn>): TReturn {
        return options.Complete(this);
    }
}