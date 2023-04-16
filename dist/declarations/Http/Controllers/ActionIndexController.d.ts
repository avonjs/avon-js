import Controller from './Controller';
import type Response from '../Responses/Response';
import type ActionRequest from '../Requests/ActionRequest';
export default class ActionIndexController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: ActionRequest): Promise<Response>;
}
//# sourceMappingURL=ActionIndexController.d.ts.map