import Ordering from '../../Orderings/Ordering';
import { type Model } from '../../Models';
import type Repository from '../../Repositories/Repository';
import type Field from '../Field';
import { type AvonRequest } from '../../Http/Requests';
export default class extends Ordering {
    protected field: Field;
    /**
     * Indicates if the field is nullable.
     */
    acceptsNullValues: boolean;
    constructor(field: Field);
    /**
     * Apply the ordering into the given repository.
     */
    apply(request: AvonRequest, repository: Repository<Model>, value: any): Promise<any>;
    /**
     * Get the query parameter key for ordering.
     */
    key(): string;
}
//# sourceMappingURL=Ordering.d.ts.map