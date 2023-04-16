import Controller from './Controller';
import type Response from '../Responses/Response';
import type ActionRequest from '../Requests/ActionRequest';
import ActionIndexResponse from '../Responses/ActionIndexResponse';

export default class ActionIndexController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ActionRequest): Promise<Response> {
    const resource = request.resource();

    return new ActionIndexResponse(
      resource
        .availableActions(request)
        .map((action) => action.serializeForIndex(request)),
    );
  }
}
