import {
  Button,
  FormControl,
  FormHelperText,
  Icon,
  InputAdornment,
  TextField
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import * as React from 'react';
import { ReactNode } from 'react';
import { changeUser, save } from './redux/userDuck';
import { matchEmail, ValidEmail } from './types/Email';
import { CompleteNameInformation } from './types/NameInformation';
import { matchPassword, ValidPassword } from './types/Password';
import { CompleteUser, User } from './types/User';
import withEventValue from './utilities/withEventValue';

type SignUpFormProps = {
  user: User;
  save: typeof save;
  changeUser: typeof changeUser;
};

const SignUpForm = (props: SignUpFormProps) => (
  <div className="sign-up__form-container">
    <h1 className="sign-up__form-title">Get Started Absolutely Free!</h1>
    <form className="sign-up__form" autoComplete="off">
      <TextField
        variant="outlined"
        className="sign-up__text-field"
        label="First Name"
        value={props.user.name.firstName}
        onChange={withEventValue(firstName =>
          props.changeUser(
            CompleteNameInformation.create(firstName, props.user.name.lastName),
            props.user.email,
            props.user.password
          )
        )}
      />
      <TextField
        variant="outlined"
        className="sign-up__text-field"
        label="Last Name"
        value={props.user.name.lastName}
        onChange={withEventValue(lastName =>
          props.changeUser(
            CompleteNameInformation.create(props.user.name.firstName, lastName),
            props.user.email,
            props.user.password
          )
        )}
      />
      <FormControl>
        <TextField
          label="Email"
          variant="outlined"
          className="sign-up__text-field"
          id="email"
          type="text"
          value={props.user.email.address}
          onChange={withEventValue(email =>
            props.changeUser(
              props.user.name,
              ValidEmail.create(email),
              props.user.password
            )
          )}
          InputProps={{
            endAdornment: props.user.email instanceof ValidEmail && (
              <InputAdornment position="end">
                <Icon>
                  <Check style={{ color: 'green' }} />
                </Icon>
              </InputAdornment>
            )
          }}
        />
        {matchEmail<ReactNode>(props.user.email, {
          Initial: () => '',
          Invalid: invalidEmail => (
            <div className="sign-up__password-container">
              {invalidEmail.errors.map(error => (
                <FormHelperText error>{error}</FormHelperText>
              ))}
            </div>
          ),
          Valid: () => ''
        })}
      </FormControl>
      <FormControl>
        <TextField
          label="Password"
          className="sign-up__text-field"
          variant="outlined"
          id="password"
          type="text"
          value={props.user.password.password}
          onChange={withEventValue(password =>
            props.changeUser(
              props.user.name,
              props.user.email,
              ValidPassword.create(
                password,
                props.user.password.confirmPassword
              )
            )
          )}
          InputProps={{
            endAdornment: props.user.password instanceof ValidPassword && (
              <InputAdornment position="end">
                <Icon>
                  <Check style={{ color: 'green' }} />
                </Icon>
              </InputAdornment>
            )
          }}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Confirm Password"
          variant="outlined"
          className="sign-up__text-field"
          id="confirm-password"
          type="text"
          value={props.user.password.confirmPassword}
          onChange={withEventValue(confirmPassword =>
            props.changeUser(
              props.user.name,
              props.user.email,
              ValidPassword.create(
                props.user.password.password,
                confirmPassword
              )
            )
          )}
          InputProps={{
            endAdornment: props.user instanceof ValidPassword && (
              <InputAdornment position="end">
                <Icon>
                  <Check style={{ color: 'green' }} />
                </Icon>
              </InputAdornment>
            )
          }}
        />
        {matchPassword<ReactNode>(props.user.password, {
          EmptyPassword: () => '',
          InvalidPassword: invalidPassword => (
            <div className="sign-up__password-container">
              {invalidPassword.errors.map(error => (
                <FormHelperText error>{error}</FormHelperText>
              ))}
            </div>
          ),
          ValidPassword: () => ''
        })}
      </FormControl>
      <Button
        className="sign-up__button"
        variant="contained"
        disabled={!(props.user instanceof CompleteUser)}
        onClick={props.save}
      >
        Sign Up!
      </Button>
    </form>
  </div>
);

export default SignUpForm;
