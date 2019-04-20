import { Button, FormControl, FormHelperText, Icon, Input, InputAdornment, InputLabel, Paper, TextField } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import * as React from "react";
import { connect } from "react-redux";
import { ReducerState } from "./redux";
import * as UserActions from "./redux/userReducer";
import { matchEmail } from "./types/Email";
import { IncompleteUser, User } from "./types/User";
import { Field, FieldWrapper, UserContainer } from "./User.styled";

type UserFormProps = {
  user: User;
};

function withEventValue<TReturnType>(func: (input: string) => TReturnType) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    func(event.target.value);
}

const UserForm = (props: UserFormProps & typeof UserActions) => (
  <UserContainer>
    <Paper>
      <FieldWrapper>
        <Field>
          <TextField
            label="First Name"
            value={props.user.name.firstName}
            style={{ width: "20vw" }}
            onChange={withEventValue(firstName =>
              props.changeName(firstName, props.user.name.lastName)
            )}
          />
        </Field>
        <Field>
          <TextField
            label="Last Name"
            value={props.user.name.lastName}
            style={{ width: "20vw" }}
            onChange={withEventValue(lastName =>
              props.changeName(props.user.name.firstName, lastName)
            )}
          />
        </Field>
        <Field>
          <FormControl>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              type="text"
              value={props.user.email.address}
              style={{ width: "20vw" }}
              onChange={withEventValue(props.changeEmail)}
              endAdornment={matchEmail<React.ReactNode>(props.user.email, {
                Initial: () => "",
                Invalid: () => "",
                Valid: () => (
                  <InputAdornment position="end">
                    <Icon>
                      <Check style={{ color: "green" }} />
                    </Icon>
                  </InputAdornment>
                )
              })}
            />
            {matchEmail<React.ReactNode>(props.user.email, {
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
        <Button
          variant="contained"
          disabled={props.user instanceof IncompleteUser}
          onClick={props.save}
        >
          Save
        </Button>
      </FieldWrapper>
    </Paper>
  </UserContainer>
);

const mapStateToProps = (state: ReducerState) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { ...UserActions }
)(UserForm);
