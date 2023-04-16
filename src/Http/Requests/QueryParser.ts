import type { ParsedUrlQuery } from 'querystring';
import type QueryParameter from './QueryParameter';
import { type MatchesQueryParameters } from '../..';

export default class QueryParser<T extends QueryParameter> {
  constructor(protected query: ParsedUrlQuery, protected handlers: T[]) {}

  /**
   * Get pair of handlers and matched values.
   */
  matches(): MatchesQueryParameters<T> {
    return this.handlers
      .filter((handler) => {
        // validate filters
        const value = this.query[handler.key()];

        return value !== undefined && !handler.isValidNullValue(value);
      })
      .map((handler) => {
        const value = this.query[handler.key()];

        return {
          handler,
          value: handler.isValidNullValue(value) ? null : value,
        };
      });
  }
}
