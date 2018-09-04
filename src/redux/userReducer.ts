import { User, ValidatedEmail } from '../types/User';

const CHANGE_FIRST_NAME = 'user/changeFirstName';
const CHANGE_LAST_NAME = 'user/changeLastName';
const CHANGE_EMAIL = 'user/changeEmail';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
const validateEmail = (email: string) : ValidatedEmail => ({
    address: email,
    isValid: emailRegex.test(email)
});

export const changeFirstName = (firstName: string) => ({ type: CHANGE_FIRST_NAME as typeof CHANGE_FIRST_NAME, firstName });
export const changeLastName = (lastName: string) => ({ type: CHANGE_LAST_NAME as typeof CHANGE_LAST_NAME, lastName });
export const changeEmail = (email: string) => ({ type: CHANGE_EMAIL as typeof CHANGE_EMAIL, email: validateEmail(email) }); 
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
        case CHANGE_FIRST_NAME:
            return {
                ...state,
                firstName: action.firstName
            };
        case CHANGE_LAST_NAME:
            return {
                ...state,
                lastName: action.lastName,
            };
        case CHANGE_EMAIL:
            return {
                ...state,
                email: action.email,
            };
        default:
            return state;
    }
}
