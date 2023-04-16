import Controller from './Controller';
import type Response from '../Responses/Response';
import type ResourceDeleteRequest from '../Requests/ResourceForceDeleteRequest';
export default class ResourceForceDeleteController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: ResourceDeleteRequest): Promise<Response>;
}
//# sourceMappingURL=ResourceForceDeleteController.d.ts.map