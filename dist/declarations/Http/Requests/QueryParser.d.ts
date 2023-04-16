/// <reference types="node" />
import type { ParsedUrlQuery } from 'querystring';
import type QueryParameter from './QueryParameter';
import { type MatchesQueryParameters } from '../..';
export default class QueryParser<T extends QueryParameter> {
    protected query: ParsedUrlQuery;
    protected handlers: T[];
    constructor(query: ParsedUrlQuery, handlers: T[]);
    /**
     * Get pair of handlers and matched values.
     */
    matches(): MatchesQueryParameters<T>;
}
//# sourceMappingURL=QueryParser.d.ts.map