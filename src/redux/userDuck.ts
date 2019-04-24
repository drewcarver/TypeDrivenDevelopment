import { Dispatch } from 'redux';
import { EmptyPassword, Password } from 'src/types/Password';
import { saveUser } from '../api/userApi';
import { Email, InitialEmail } from '../types/Email';
import { IncompleteUser, User } from '../types/User';
import { createAction } from '../utilities/actionCreator';
import { IncompleteNameInformation, NameInformation } from './../types/NameInformation';
import { CompleteUser, matchUser, SavedUser } from './../types/User';
import { GetState } from './index';

export enum ActionTypes {
    CHANGE_USER = 'user/changeUser',
    SAVE_SUCCESSS = 'user/saveSuccessful',
    SAVE_USER = 'user/save',
};
export const changeUser = (name: NameInformation, email : Email, password: Password) => createAction(ActionTypes.CHANGE_USER, CompleteUser.create(name, email, password));
const saveSuccessful = (user : SavedUser) => createAction(ActionTypes.SAVE_SUCCESSS, user);

export const save = () => (dispatch : Dispatch, getState : GetState) => {
    return matchUser<Promise<User>>(getState().user, {
        Complete: (completeUser) => saveUser(completeUser).then((savedUser) => { 
            dispatch(saveSuccessful(savedUser));
            return Promise.resolve(savedUser);
        }),
        Incomplete: (u) => Promise.resolve(u),
        Saved: (u) => Promise.resolve(u),
    });
}

type UserReducerState = User; 

type UserActions = ReturnType<typeof changeUser>
    | ReturnType<typeof saveSuccessful>;

const DEFAULT_STATE : UserReducerState = new IncompleteUser(new IncompleteNameInformation('', ''), new InitialEmail(), new EmptyPassword());

export default (state: UserReducerState = DEFAULT_STATE, action: UserActions) : UserReducerState => {
    switch(action.type) {
        case ActionTypes.CHANGE_USER:
            return action.payload;
        case ActionTypes.SAVE_SUCCESSS:
            return action.payload;
        default:
            return state;
    }
}
