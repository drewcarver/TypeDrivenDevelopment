import { User } from '../types/User';
import { createAction } from '../utilities/actionCreator';
import validateEmail from '../utilities/emailValidator';

export enum ActionTypes {
    CHANGE_FIRST_NAME = 'user/changeFirstName',
    CHANGE_LAST_NAME = 'user/changeLastName',
    CHANGE_EMAIL = 'user/changeEmail',
};

// export const changeFirstName = (firstName: string) => ({ type: CHANGE_FIRST_NAME as typeof CHANGE_FIRST_NAME, firstName });
// export const changeLastName = (lastName: string) => ({ type: CHANGE_LAST_NAME as typeof CHANGE_LAST_NAME, lastName });
// export const changeEmail = (email: string) => ({ type: CHANGE_EMAIL as typeof CHANGE_EMAIL, email: validateEmail(email) }); 
export const changeFirstName = (firstName: string) => createAction(ActionTypes.CHANGE_FIRST_NAME, firstName)
export const changeLastName = (lastName: string) => createAction(ActionTypes.CHANGE_LAST_NAME, lastName);
export const changeEmail = (email: string) => createAction(ActionTypes.CHANGE_EMAIL, email);

type UserReducerState = User; 

type UserActions = ReturnType<typeof changeFirstName>
    | ReturnType<typeof changeLastName>
    | ReturnType<typeof changeEmail>;

const DEFAULT_STATE : UserReducerState = {
    email: validateEmail(''),
    firstName: '',
    lastName: '',
};

export default (state: UserReducerState = DEFAULT_STATE, action: UserActions) => {
    switch(action.type) {
        case ActionTypes.CHANGE_FIRST_NAME:
            return {
                ...state,
                firstName: action.payload
            };
        case ActionTypes.CHANGE_LAST_NAME:
            return {
                ...state,
                lastName: action.payload,
            };
        case ActionTypes.CHANGE_EMAIL:
            return {
                ...state,
                email: action.payload,
            };
        default:
            return state;
    }
}
