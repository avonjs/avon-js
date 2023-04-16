import { type AvonRequest } from '../Http/Requests';
import type Repository from '../Repositories/Repository';
import Filter from './Filter';
export default class PrimaryKey extends Filter {
    constructor(...args: readonly []);
    /**
     * Apply the filter into the given repository.
     */
    apply(request: AvonRequest, repository: Repository, value: any): any;
}
//# sourceMappingURL=ResourceId.d.ts.map