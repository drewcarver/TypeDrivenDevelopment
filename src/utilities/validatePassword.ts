import { validation, Validation } from "folktale";

type PasswordConfirmationPair = {
  originalPassword: string;
  confirmationPassword: string;
};

function isGreaterThan8Characters(
  password: PasswordConfirmationPair
): Validation<string[], PasswordConfirmationPair> {
  return password.originalPassword.length > 8
    ? validation.Success(password)
    : validation.Failure(["Password must be greater than 8 characters."]);
}

function passwordsMustMatch(
  password: PasswordConfirmationPair
): Validation<string[], PasswordConfirmationPair> {
  return password.originalPassword === password.confirmationPassword
    ? validation.Success(password)
    : validation.Failure(["Passwords must match."]);
}

function mustMeetComplexityRequirements(
  password: PasswordConfirmationPair
): Validation<string[], PasswordConfirmationPair> {
  const containsUpperCase = /[A-Z]/g;
  const containsLowerCase = /[a-z]/g;
  const containsNumberOrSymbol = /(\d|\W)/g;

  return containsUpperCase.test(password.originalPassword) &&
    containsLowerCase.test(password.originalPassword) &&
    containsNumberOrSymbol.test(password.originalPassword)
    ? validation.Success(password)
    : validation.Failure([
        "Password must contain at least one upper case, lower case and a number or symbol."
      ]);
}

function validatePassword(
  password: PasswordConfirmationPair
): Validation<string[], PasswordConfirmationPair> {
  return validation
    .Success<string[], PasswordConfirmationPair>(password)
    .concat(isGreaterThan8Characters(password))
    .concat(passwordsMustMatch(password))
    .concat(mustMeetComplexityRequirements(password));
}

export default validatePassword;
