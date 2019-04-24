import * as React from "react";
import { connect } from "react-redux";
import Confirmation from "./Confirmation";
import { ReducerState } from "./redux";
import * as UserActions from "./redux/userDuck";
import "./SignUp.css";
import SignUpForm from "./SignUpForm";

type SignUpFormProps = {
  user: UserActions.UserReducerState;
} & typeof UserActions;

const SignUp = (props: SignUpFormProps) => {
  return (
    <div className="sign-up">
      <div className="sign-up__background">
        <span className="sign-up__welcome-message">Welcome!</span>
      </div>
      {props.user.isSaved ? (
        <Confirmation />
      ) : (
        <SignUpForm
          save={props.save}
          changeUser={props.changeUser}
          user={props.user}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: ReducerState) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { ...UserActions }
)(SignUp);
