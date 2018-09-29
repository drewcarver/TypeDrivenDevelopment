import {
  FormControl,
  FormHelperText,
  Paper,
  TextField
} from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { ReducerState } from "./redux";
import * as UserActions from "./redux/userReducer";
import { matchEmail } from "./types/Email";
import { User } from "./types/User";
import { Field, UserContainer } from "./User.styled";

type UserProps = {
  user: User;
};

function withEventValue<TReturnType>(func: (input: string) => TReturnType) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    func(event.target.value);
}

const User = (props: UserProps & typeof UserActions) => (
  <Paper>
    <UserContainer>
      <Field>
        <TextField
          label="First Name"
          value={props.user.name.firstName}
          onChange={withEventValue(firstName =>
            props.changeName(firstName, props.user.name.lastName)
          )}
        />
      </Field>
      <Field>
        <TextField
          label="Last Name"
          value={props.user.name.lastName}
          onChange={withEventValue(lastName =>
            props.changeName(props.user.name.firstName, lastName)
          )}
        />
      </Field>
      <Field>
        <FormControl>
          <TextField
            error={
              props.user.email.key === "Invalid" &&
              !!props.user.email.errors.length
            }
            label="Email Address"
            value={props.user.email.address}
            onChange={withEventValue(props.changeEmail)}
          />
          {matchEmail<JSX.Element | string>(props.user.email, {
            Initial: () => "",
            Invalid: incompleteEmail => (
              <React.Fragment>
                {incompleteEmail.errors.map(error => (
                  <FormHelperText error>{error}</FormHelperText>
                ))}
              </React.Fragment>
            ),
            Valid: email => (
              <FormHelperText>
                {`${email.address} is a valid email!`}
              </FormHelperText>
            )
          })}
        </FormControl>
      </Field>
      <button onClick={props.save}>Save</button>
    </UserContainer>
  </Paper>
);

const mapStateToProps = (state: ReducerState) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { ...UserActions }
)(User);
