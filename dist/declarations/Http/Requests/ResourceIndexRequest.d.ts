import type Filter from '../../Filters/Filter';
import type Ordering from '../../Orderings/Ordering';
import { AvonRequest, RequestTypes } from '.';
import { TrashedStatus } from '../../Mixins/SoftDeletes';
import { type MatchesQueryParameters, type IndexSerilizedResource } from '../..';
export default class ResourceIndexRequest extends AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type(): RequestTypes;
    /**
     * Get the paginator instance for the index request.
     */
    searchIndex(): Promise<{
        resources: IndexSerilizedResource[];
        count: number;
    }>;
    /**
     * Get the page number.
     */
    currentPage(): number;
    /**
     * Get per page.
     */
    perPage(): number;
    /**
     * Get the filters for the request.
     */
    filters(): MatchesQueryParameters<Filter>;
    /**
     * Get all of the possibly available filters for the request.
     */
    protected availableFilters(): Filter[];
    /**
     * Check if filter found in request.
     */
    protected hasFilter(key: string): boolean;
    /**
     * Get the orderings for the request.
     */
    protected orderings(): MatchesQueryParameters<Ordering>;
    /**
     * Get all of the possibly available orderings for the request.
     */
    protected availableOrderings(): Ordering[];
    protected trashed(): TrashedStatus;
}
//# sourceMappingURL=ResourceIndexRequest.d.ts.map