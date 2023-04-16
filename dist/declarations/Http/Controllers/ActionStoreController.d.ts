import Controller from './Controller';
import type Response from '../Responses/Response';
import type ActionRequest from '../Requests/ActionRequest';
export default class ActionStoreController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: ActionRequest): Promise<Response>;
}
//# sourceMappingURL=ActionStoreController.d.ts.map