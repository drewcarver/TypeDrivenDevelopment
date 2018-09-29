type ReturnFunction<TInput, TReturn> = (param : TInput) => TReturn;

type DiscriminateUnion<T, K extends keyof T, V extends T[K], TReturn> = 
  T extends Record<K, V> ? ReturnFunction<T, TReturn> : never

export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T, TReturn> =
  { [V in T[K]]: DiscriminateUnion<T, K, V, TReturn> };
