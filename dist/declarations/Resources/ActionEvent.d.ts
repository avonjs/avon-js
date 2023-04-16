import type Repository from '../Repositories/Repository';
import type Field from '../Fields/Field';
import { type AvonRequest } from '../Http/Requests';
import Resource from '../Resource';
export default class ActionEvent extends Resource {
    /**
     * Get the fields available on the entity.
     */
    fields(request: AvonRequest): Field[];
    /**
     * Get the repository.
     */
    repository(): Repository;
}
//# sourceMappingURL=ActionEvent.d.ts.map