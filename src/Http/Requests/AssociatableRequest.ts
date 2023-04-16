import type Filter from '../../Filters/Filter';
import { type MatchesQueryParameters, RequestTypes } from '.';
import ResourceIndexRequest from './ResourceIndexRequest';
import { type Ordering } from '../../Orderings';

export default class AssociatableRequest extends ResourceIndexRequest {
  /**
   * Indicates type of the request instance.
   */
  type(): RequestTypes {
    return RequestTypes.AssociatableRequest;
  }

  /**
   * Get the filters for the request.
   */
  public filters(): MatchesQueryParameters<Filter> {
    return [];
  }

  /**
   * Get the orderings for the request.
   */
  public orderings(): MatchesQueryParameters<Ordering> {
    return [];
  }
}
