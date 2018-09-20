import { Dispatch } from 'redux';
import { saveUser } from '../api/userApi';
import { InitialEmail, ValidEmail } from '../types/Email';
import { IncompleteUser, User } from '../types/User';
import { createAction } from '../utilities/actionCreator';
import { CompleteUser, SavedUser } from './../types/User';
import { GetState } from './index';

export enum ActionTypes {
    CHANGE_EMAIL = 'user/changeEmail',
    CHANGE_FIRST_NAME = 'user/changeFirstName',
    CHANGE_LAST_NAME = 'user/changeLastName',
    SAVE_SUCCESSS = 'user/saveSuccessful',
    SAVE_USER = 'user/save',
};
export const changeFirstName = (firstName: string) => createAction(ActionTypes.CHANGE_FIRST_NAME, firstName)
export const changeLastName = (lastName: string) => createAction(ActionTypes.CHANGE_LAST_NAME, lastName);
export const changeEmail = (email: string) => createAction(ActionTypes.CHANGE_EMAIL, ValidEmail.create(email));
const saveSuccessful = (user : SavedUser) => createAction(ActionTypes.SAVE_SUCCESSS, user);

export const save = () => (dispatch : Dispatch, getState : GetState) => {
    return getState().user.match<Promise<User>>({
        Complete: (completeUser) => saveUser(completeUser).then((savedUser) => { 
            dispatch(saveSuccessful(savedUser));
            return Promise.resolve(savedUser);
        }),
        Incomplete: (u) => Promise.resolve(u),
        Saved: (u) => Promise.resolve(u),
    });
}

type UserReducerState = User; 

type UserActions = ReturnType<typeof changeFirstName>
    | ReturnType<typeof changeLastName>
    | ReturnType<typeof saveSuccessful>
    | ReturnType<typeof changeEmail>;

const DEFAULT_STATE : UserReducerState = new IncompleteUser('', '', new InitialEmail());

export default (state: UserReducerState = DEFAULT_STATE, action: UserActions) : UserReducerState => {
    switch(action.type) {
        case ActionTypes.CHANGE_FIRST_NAME:
            return CompleteUser.create(action.payload, state.lastName, state.email);
        case ActionTypes.CHANGE_LAST_NAME:
            return CompleteUser.create(state.firstName, action.payload, state.email);
        case ActionTypes.CHANGE_EMAIL:
            return CompleteUser.create(state.firstName, state.lastName, action.payload);
        case ActionTypes.SAVE_SUCCESSS:
            return action.payload;
        default:
            return state;
    }
}
