import { validation, Validation } from 'folktale';

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

function validateEmail(email: string) : Validation<string[], string> {
    return validation.Success<string[], string>(email)
        .concat(isMissingAtSign(email))
        .concat(isMissingDomain(email))
        .concat(doesntPassEmailRegex(email));
}

export default validateEmail;