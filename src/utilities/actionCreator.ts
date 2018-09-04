export type Action<TAction extends string> = {
    type: TAction
};

export type ActionWithPayload<TAction extends string, TPayload> = Action<TAction> & {
    payload: TPayload
};

export function createAction<T extends string>(type: T): Action<T> 
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P> 
export function createAction<T extends string, P>(type: T, payload?: P) {
    return payload 
        ? { type }
        : { type, payload };
}
