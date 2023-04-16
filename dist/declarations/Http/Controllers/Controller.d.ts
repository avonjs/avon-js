import { type AvonRequest } from '../Requests';
import type Response from '../Responses/Response';
export default class Controller {
    /**
     * Default route handler
     */
    __invoke(request: AvonRequest): Promise<Response>;
}
//# sourceMappingURL=Controller.d.ts.map