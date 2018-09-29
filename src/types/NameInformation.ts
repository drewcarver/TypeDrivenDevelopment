import { MapDiscriminatedUnion } from "./MapDiscriminatedUnion";

export type NameInformation = CompleteNameInformation
| IncompleteNameInformation;

type NameOptions<TReturn> = MapDiscriminatedUnion<NameInformation, 'key', TReturn>;

export function matchName<TReturn>(name : NameInformation, options : NameOptions<TReturn>) {
    switch (name.key) {
        case "Incomplete":
            return options.Incomplete(name);
        case "Complete":
            return options.Complete(name);
    }
}

export class IncompleteNameInformation {
    public readonly key = 'Incomplete';    

    public constructor(public readonly firstName: string, public readonly lastName: string) {}
}

export class CompleteNameInformation {
    public static create(firstName: string, lastName: string) {
        return firstName && lastName
            ? new CompleteNameInformation(firstName, lastName)
            : new IncompleteNameInformation(firstName, lastName);
    }
    public readonly key = 'Complete';

    private constructor(public readonly firstName: string, public readonly lastName: string) {}
}