export type Update<T> = T | ((prev: T) => T)
