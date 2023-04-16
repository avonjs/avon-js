import Controller from './Controller';
import type ResourceCreateOrAttachRequest from '../Requests/ResourceCreateOrAttachRequest';
import type Response from '../Responses/Response';
export default class ResourceStoreController extends Controller {
    /**
     * Default route handler
     */
    __invoke(request: ResourceCreateOrAttachRequest): Promise<Response>;
}
//# sourceMappingURL=ResourceStoreController.d.ts.map