import Controller from './Controller';
import type Response from '../Responses/Response';
import type ResourceDeleteRequest from '../Requests/ResourceDeleteRequest';
export default class ResourceDeleteController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: ResourceDeleteRequest): Promise<Response>;
}
//# sourceMappingURL=ResourceDeleteController.d.ts.map