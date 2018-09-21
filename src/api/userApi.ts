import { CompleteUser } from '../types/User';
import { SavedUser } from './../types/User';

export const saveUser = (user: CompleteUser) : Promise<SavedUser> => {
    return Promise.resolve(new SavedUser(user.name, user.email, 1));
}