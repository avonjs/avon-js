import Controller from './Controller';
import type Response from '../Responses/Response';
import type ResourceRestoreRequest from '../Requests/ResourceRestoreRequest';
export default class ResourceRestoreController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: ResourceRestoreRequest): Promise<Response>;
}
//# sourceMappingURL=ResourceRestoreController.d.ts.map