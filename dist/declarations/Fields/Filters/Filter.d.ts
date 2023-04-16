import Filter from '../../Filters/Filter';
import { type AvonRequest } from '../../Http/Requests';
import { type Model } from '../../Models';
import type Repository from '../../Repositories/Repository';
import type Field from '../Field';
export default abstract class extends Filter {
    protected field: Field;
    /**
     * Indicates if the field is nullable.
     */
    acceptsNullValues: boolean;
    constructor(field: Field);
    /**
     * Apply the filter into the given repository.
     */
    apply(request: AvonRequest, repository: Repository<Model>, value: any): Promise<any>;
    /**
     * Get the query parameter key for filter.
     */
    key(): string;
}
//# sourceMappingURL=Filter.d.ts.map