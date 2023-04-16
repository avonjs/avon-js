import Controller from './Controller';
import type Response from '../Responses/Response';
import type AssociatableRequest from '../Requests/AssociatableRequest';
export default class AssociatableController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: AssociatableRequest): Promise<Response>;
}
//# sourceMappingURL=AssociatableController.d.ts.map