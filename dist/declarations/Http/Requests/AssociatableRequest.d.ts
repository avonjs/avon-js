import type Filter from '../../Filters/Filter';
import { type MatchesQueryParameters, RequestTypes } from '.';
import ResourceIndexRequest from './ResourceIndexRequest';
import { type Ordering } from '../../Orderings';
export default class AssociatableRequest extends ResourceIndexRequest {
    /**
     * Indicates type of the request instance.
     */
    type(): RequestTypes;
    /**
     * Get the filters for the request.
     */
    filters(): MatchesQueryParameters<Filter>;
    /**
     * Get the orderings for the request.
     */
    orderings(): MatchesQueryParameters<Ordering>;
}
//# sourceMappingURL=AssociatableRequest.d.ts.map