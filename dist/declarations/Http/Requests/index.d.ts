import type QueryParameter from './QueryParameter';
export * from './AvonRequest';
export type MatchesQueryParameters<T extends QueryParameter> = Array<{
    handler: T;
    value: any;
}>;
//# sourceMappingURL=index.d.ts.map