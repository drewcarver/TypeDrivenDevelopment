type ReducerCase<TState, TAction> = (state: TState, action: TAction) => TState;

type DiscriminateUnion<
  TReducer,
  T,
  K extends keyof T,
  V extends T[K]
> = T extends Record<K, V> ? ReducerCase<TReducer, T> : never;

type MapDiscriminatedUnion<
  TReducer,
  T extends Record<K, string>,
  K extends keyof T
> = { [V in T[K]]: DiscriminateUnion<TReducer, T, K, V> };

export default function createReducer<
  TReducerState,
  TActionUnion extends Record<"type", string>
>(
  defaultState: TReducerState,
  reducerOptions: MapDiscriminatedUnion<TReducerState, TActionUnion, "type">
) {
  return (state: TReducerState, action: TActionUnion): TReducerState => {
    if (state === undefined) {
      return defaultState;
    }
    return reducerOptions[action.type]
      ? reducerOptions[action.type](state, action)
      : state;
  };
}
