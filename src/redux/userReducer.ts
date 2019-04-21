import { Dispatch } from "redux";
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
const saveSuccessful = (user: User) =>
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
};

type UserActions =
  | ReturnType<typeof changeUser>
  | ReturnType<typeof saveSuccessful>;

const DEFAULT_STATE: UserReducerState = {
  confirmPassword: "",
  email: "",
  firstName: "",
  isEmailValid: false,
  isPasswordValid: false,
  lastName: "",
  password: ""
};

export default (
  state: UserReducerState = DEFAULT_STATE,
  action: UserActions
): UserReducerState => {
  switch (action.type) {
    case ActionTypes.CHANGE_USER:
      return {
        ...state,
        ...action.payload
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
