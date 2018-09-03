import { combineReducers, createStore } from 'redux';

import userReducer from './userReducer';

const reducers = combineReducers({
    user: userReducer
});

export type ReducerState = ReturnType<typeof reducers>;

export default () => createStore(reducers, 
    /* tslint:disable */
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    /* tslint:enable */
);
