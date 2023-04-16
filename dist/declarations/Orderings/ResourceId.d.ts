import { type AvonRequest } from '../Http/Requests';
import { type Repository } from '../Repositories';
import Ordering from './Ordering';
export default class PrimaryKey extends Ordering {
    /**
     * Apply the filter into the given repository.
     */
    apply(request: AvonRequest, repository: Repository, value: any): any;
}
//# sourceMappingURL=ResourceId.d.ts.map