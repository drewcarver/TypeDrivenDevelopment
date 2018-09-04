export type ValidatedEmail = {
    address: string
    isValid: boolean
};

export type User = {
    firstName: string,
    lastName: string,
    email: ValidatedEmail,
};