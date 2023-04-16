export type Mixable<T = Record<any, any>> = new (...args: any[]) => T;
export type AbstractMixable<T = Record<any, any>> = abstract new (
  ...args: any[]
) => T;
