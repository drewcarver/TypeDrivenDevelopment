import {
  Button,
  FormControl,
  FormHelperText,
  Icon,
  InputAdornment,
  TextField
} from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import * as React from "react";
import userDuck, { changeUser, save } from "./redux/userDuck";
import withEventValue from "./utilities/withEventValue";

type SignUpFormProps = {
  user: ReturnType<typeof userDuck>;
  changeUser: typeof changeUser;
  save: typeof save;
};

const SignUpForm = (props: SignUpFormProps) => (
  <div className="sign-up__form-container">
    <h1 className="sign-up__form-title">Get Started Absolutely Free!</h1>
    <form className="sign-up__form" autoComplete="off">
      <TextField
        variant="outlined"
        className="sign-up__text-field"
        label="First Name"
        value={props.user.firstName}
        onChange={withEventValue(firstName =>
          props.changeUser(
            firstName,
            props.user.lastName,
            props.user.email,
            props.user.password,
            props.user.confirmPassword
          )
        )}
      />
      <TextField
        variant="outlined"
        className="sign-up__text-field"
        label="Last Name"
        value={props.user.lastName}
        onChange={withEventValue(lastName =>
          props.changeUser(
            props.user.firstName,
            lastName,
            props.user.email,
            props.user.password,
            props.user.confirmPassword
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
          value={props.user.email}
          onChange={withEventValue(email =>
            props.changeUser(
              props.user.firstName,
              props.user.lastName,
              email,
              props.user.password,
              props.user.confirmPassword
            )
          )}
          InputProps={{
            endAdornment: props.user.isEmailValid && (
              <InputAdornment position="end">
                <Icon>
                  <Check style={{ color: "green" }} />
                </Icon>
              </InputAdornment>
            )
          }}
        />
        <div className="sign-up__password-container">
          {props.user.emailErrors.map(error => (
            <FormHelperText error>{error}</FormHelperText>
          ))}
        </div>
      </FormControl>
      <FormControl>
        <TextField
          label="Password"
          className="sign-up__text-field"
          variant="outlined"
          id="password"
          type="text"
          value={props.user.password}
          onChange={withEventValue(password =>
            props.changeUser(
              props.user.firstName,
              props.user.lastName,
              props.user.email,
              password,
              props.user.confirmPassword
            )
          )}
          InputProps={{
            endAdornment: props.user.isPasswordValid && (
              <InputAdornment position="end">
                <Icon>
                  <Check style={{ color: "green" }} />
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
          value={props.user.confirmPassword}
          onChange={withEventValue(confirmPassword =>
            props.changeUser(
              props.user.firstName,
              props.user.lastName,
              props.user.email,
              props.user.password,
              confirmPassword
            )
          )}
          InputProps={{
            endAdornment: props.user.isPasswordValid && (
              <InputAdornment position="end">
                <Icon>
                  <Check style={{ color: "green" }} />
                </Icon>
              </InputAdornment>
            )
          }}
        />
        {
          <div className="sign-up__password-container">
            {props.user.passwordErrors.map(error => (
              <FormHelperText error>{error}</FormHelperText>
            ))}
          </div>
        }
      </FormControl>
      <Button
        className="sign-up__button"
        variant="contained"
        disabled={
          !props.user.isEmailValid ||
          !props.user.isPasswordValid ||
          props.user.firstName.length === 0 ||
          props.user.lastName.length === 0
        }
        onClick={props.save}
      >
        Sign Up!
      </Button>
    </form>
  </div>
);

export default SignUpForm;
