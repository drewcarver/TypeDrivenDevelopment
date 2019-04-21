import {
  Button,
  FormControl,
  FormHelperText,
  Icon,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  TextField
} from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import * as React from "react";
import { connect } from "react-redux";
import { ReducerState } from "./redux";
import * as UserActions from "./redux/userReducer";
import { matchEmail, ValidEmail } from "./types/Email";
import { CompleteNameInformation } from "./types/NameInformation";
import { matchPassword, ValidPassword } from "./types/Password";
import { Field, FieldWrapper, UserContainer } from "./User.styled";
import { User } from "./redux/userReducer";

type SignUpFormProps = {
  user: UserActions.UserReducerState;
} & typeof UserActions;

function withEventValue<TReturnType>(func: (input: string) => TReturnType) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    func(event.target.value);
}

const SignUpForm = (props: SignUpFormProps) => (
  <UserContainer>
    <Paper>
      <form autoComplete="off">
        <FieldWrapper>
          <Field>
            <TextField
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
          </Field>
          <Field>
            <TextField
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
          </Field>
          <Field>
            <FormControl>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                type="text"
                value={props.user.email}
                onChange={withEventValue(email =>
                  props.changeUser(
                    props.user.firstName,
                    props.user.lastName,
                    props.user.email,
                    props.user.password,
                    props.user.confirmPassword
                  )
                )}
                endAdornment={props.user.isEmailValid && (
                    <InputAdornment position="end">
                      <Icon>
                        <Check style={{ color: "green" }} />
                      </Icon>
                    </InputAdornment>
                  )
                }
              />
              {!props.user.isEmailValid && props.user. {
                Initial: () => "",
                Invalid: incompleteEmail => (
                  <React.Fragment>
                    {incompleteEmail.errors.map(error => (
                      <FormHelperText error>{error}</FormHelperText>
                    ))}
                  </React.Fragment>
                ),
                Valid: () => ""
              })}
            </FormControl>
          </Field>
          <Field>
            <FormControl>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
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
                endAdornment={matchPassword<React.ReactNode>(
                  props.user.password,
                  {
                    EmptyPassword: () => "",
                    InvalidPassword: () => "",
                    ValidPassword: () => (
                      <InputAdornment position="end">
                        <Icon>
                          <Check style={{ color: "green" }} />
                        </Icon>
                      </InputAdornment>
                    )
                  }
                )}
              />
            </FormControl>
          </Field>
          <Field>
            <FormControl>
              <InputLabel htmlFor="confirm-password">
                Confirm Password
              </InputLabel>
              <Input
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
                endAdornment={matchPassword<React.ReactNode>(
                  props.user.password,
                  {
                    EmptyPassword: () => "",
                    InvalidPassword: () => "",
                    ValidPassword: () => (
                      <InputAdornment position="end">
                        <Icon>
                          <Check style={{ color: "green" }} />
                        </Icon>
                      </InputAdornment>
                    )
                  }
                )}
              />
              {matchPassword<React.ReactNode>(props.user.password, {
                EmptyPassword: () => "",
                InvalidPassword: InvalidPassword => (
                  <React.Fragment>
                    {InvalidPassword.errors.map(error => (
                      <FormHelperText error>{error}</FormHelperText>
                    ))}
                  </React.Fragment>
                ),
                ValidPassword: () => ""
              })}
            </FormControl>
          </Field>
          <Button
            variant="contained"
            disabled={props.user instanceof IncompleteUser}
            onClick={props.save}
          >
            Save
          </Button>
        </FieldWrapper>
      </form>
    </Paper>
  </UserContainer>
);

const mapStateToProps = (state: ReducerState) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { ...UserActions }
)(SignUpForm);
