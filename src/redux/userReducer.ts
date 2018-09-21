import { Dispatch } from 'redux';
import { saveUser } from '../api/userApi';
import { InitialEmail, ValidEmail } from '../types/Email';
import { IncompleteUser, User } from '../types/User';
import { createAction } from '../utilities/actionCreator';
import { CompleteNameInformation, IncompleteNameInformation } from './../types/NameInformation';
import { CompleteUser, SavedUser } from './../types/User';
import { GetState } from './index';

export enum ActionTypes {
    CHANGE_EMAIL = 'user/changeEmail',
    CHANGE_NAME = 'user/changeName',
    SAVE_SUCCESSS = 'user/saveSuccessful',
    SAVE_USER = 'user/save',
};
export const changeName = (firstName : string, lastName : string) => createAction(ActionTypes.CHANGE_NAME, CompleteNameInformation.create(firstName, lastName));
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

type UserActions = ReturnType<typeof changeName>
    | ReturnType<typeof saveSuccessful>
    | ReturnType<typeof changeEmail>;

const DEFAULT_STATE : UserReducerState = new IncompleteUser(new IncompleteNameInformation('', ''), new InitialEmail());

export default (state: UserReducerState = DEFAULT_STATE, action: UserActions) : UserReducerState => {
    switch(action.type) {
        case ActionTypes.CHANGE_NAME:
            return CompleteUser.create(action.payload, state.email);
        case ActionTypes.CHANGE_EMAIL:
            return CompleteUser.create(state.name, action.payload);
        case ActionTypes.SAVE_SUCCESSS:
            return action.payload;
        default:
            return state;
    }
}
