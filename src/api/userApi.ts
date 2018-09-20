import { CompleteUser } from '../types/User';
import { SavedUser } from './../types/User';

export const saveUser = (user: CompleteUser) : Promise<SavedUser> => {
    return Promise.resolve(new SavedUser(user.firstName, user.lastName, user.email, 1));
}