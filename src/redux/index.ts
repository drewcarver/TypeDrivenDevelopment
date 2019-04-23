import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import userReducer from "./userDuck";

const reducers = combineReducers({
  user: userReducer
});

export type ReducerState = ReturnType<typeof reducers>;
export type GetState = () => ReducerState;

export default () =>
  createStore(
    reducers,
    /* tslint:disable */
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    /* tslint:enable */
    applyMiddleware(thunk)
  );
