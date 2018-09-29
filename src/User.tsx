import { Button, FormControl, FormHelperText, Icon, Input, InputAdornment, InputLabel, Paper, TextField } from "@material-ui/core";
import Check from '@material-ui/icons/Check';
import * as React from "react";
import { connect } from "react-redux";
import { ReducerState } from "./redux";
import * as UserActions from "./redux/userReducer";
import { matchEmail } from "./types/Email";
import { User } from "./types/User";
import { Field, FieldWrapper, UserContainer } from "./User.styled";

type UserProps = {
  user: User;
};

function withEventValue<TReturnType>(func: (input: string) => TReturnType) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    func(event.target.value);
}

const User = (props: UserProps & typeof UserActions) => (
  <UserContainer>
    <Paper>
      <FieldWrapper>
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
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input 
              id="email"
              type="text"
              value={props.user.email.address}
              onChange={withEventValue(props.changeEmail)}
              endAdornment={
                props.user.email.key === "Valid"
                ? <InputAdornment position="end">
                    <Icon>
                      <Check style={{ color: "green" }} />
                    </Icon>
                  </InputAdornment>
                : ''
              } 
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
        <Button variant="contained" onClick={props.save}>Save</Button>
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
)(User);
