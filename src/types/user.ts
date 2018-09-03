export type ValidEmail = string;
export type InvalidEmail = {
    email: string,
    errorMessage: string,
};

export type User = {
    firstName: string,
    lastName: string,
    email: ValidEmail
};

export type IncompleteUser = {
    firstName: string,
    lastName: string,
    email: InvalidEmail,
};