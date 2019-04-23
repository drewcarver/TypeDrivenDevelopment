import { Dispatch } from "redux";
import validateEmail from "src/utilities/validateEmail";
import validatePassword from "src/utilities/validPassword";
import { createAction } from "../utilities/actionCreator";
import { GetState } from "./index";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export enum ActionTypes {
  CHANGE_USER = "user/changeUser",
  SAVE_SUCCESSS = "user/saveSuccessful",
  SAVE_USER = "user/save"
}

export const changeUser = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
) =>
  createAction(ActionTypes.CHANGE_USER, {
    confirmPassword,
    email,
    firstName,
    lastName,
    password
  });

export const saveSuccessful = (user: User) =>
  createAction(ActionTypes.SAVE_SUCCESSS, user);
export const save = () => (dispatch: Dispatch, getState: GetState) => {
  const savedUser = getState().user;
  dispatch(saveSuccessful(savedUser));
  return Promise.resolve(savedUser);
};

export type UserReducerState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  emailErrors: string[];
  passwordErrors: string[];
};

type UserActions =
  | ReturnType<typeof changeUser>
  | ReturnType<typeof saveSuccessful>;

const DEFAULT_STATE: UserReducerState = {
  confirmPassword: "",
  email: "",
  emailErrors: [],
  firstName: "",
  isEmailValid: false,
  isPasswordValid: false,
  lastName: "",
  password: "",
  passwordErrors: []
};

const getEmailErrors = (email: string) =>
  email !== ""
    ? validateEmail(email).matchWith({
        Failure: errors => errors.value,
        Success: () => []
      })
    : [];

const getPasswordErrors = (password: string, confirmPassword: string) =>
  password !== ""
    ? validatePassword({
        confirmationPassword: confirmPassword,
        originalPassword: password
      }).matchWith({
        Failure: errors => errors.value,
        Success: () => []
      })
    : [];

export default (
  state: UserReducerState = DEFAULT_STATE,
  action: UserActions
): UserReducerState => {
  switch (action.type) {
    case ActionTypes.CHANGE_USER:
      const emailErrors = getEmailErrors(action.payload.email);
      const passwordErrors = getPasswordErrors(
        action.payload.password,
        action.payload.confirmPassword
      );

      return {
        ...state,
        ...action.payload,
        emailErrors,
        isEmailValid: action.payload.email !== "" && emailErrors.length === 0,
        isPasswordValid:
          action.payload.password.length > 0 &&
          action.payload.confirmPassword.length > 0 &&
          passwordErrors.length === 0,
        passwordErrors
      };
    case ActionTypes.SAVE_SUCCESSS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
