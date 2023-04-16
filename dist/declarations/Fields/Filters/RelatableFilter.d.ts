import { type AvonRequest } from '../../Http/Requests';
import Filter from './Filter';
import { type Model } from '../../Models';
import type Repository from '../../Repositories/Repository';
import { type Validator } from '../../Mixins/Nullable';
export default class RelatableFilter extends Filter {
    /**
     * Values which will be replaced to null.
     */
    nullValidator: Validator;
    /**
     * Apply the filter into the given repository.
     */
    apply(request: AvonRequest, repository: Repository<Model>, value: any): Promise<any>;
    /**
     * Get the query parameter key for filter.
     */
    key(): string;
}
//# sourceMappingURL=RelatableFilter.d.ts.map