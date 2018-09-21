type ReturnFunction<TInput, TReturn> = (param : TInput) => TReturn;

type DiscriminateUnion<T, K extends keyof T, V extends T[K], TReturn> = 
  T extends Record<K, V> ? ReturnFunction<T, TReturn> : never

export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T, TReturn> =
  { [V in T[K]]: DiscriminateUnion<T, K, V, TReturn> };

abstract class MatchableBase<TUnion extends Record<Key, string>, Key extends keyof TUnion> {
    protected abstract key : string;

    public abstract match<TReturn>(options : MapDiscriminatedUnion<TUnion, Key, TReturn>) : TReturn;
}

export interface IMatchable<TUnion extends Record<'key', string>> { 
    key : string;
    match<TReturn>(options : MapDiscriminatedUnion<TUnion, 'key', TReturn>) : TReturn;
}

export default MatchableBase;
