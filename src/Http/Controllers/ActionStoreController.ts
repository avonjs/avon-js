import Controller from './Controller';
import type Response from '../Responses/Response';
import type ActionRequest from '../Requests/ActionRequest';

export default class ActionStoreController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ActionRequest): Promise<Response> {
    const action = request.action();
    // validate required fileds
    await action.validate(request);
    // run action
    return await action.handleRequest(request);
  }
}
