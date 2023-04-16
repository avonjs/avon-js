import type Action from '../../Actions/Action';
import { AvonRequest, RequestTypes } from '.';
import ActionNotFoundException from '../../Exceptions/ActionNotFoundException';
import { type Model } from '../../Models';

export default class ActionRequest extends AvonRequest {
  /**
   * Indicates type of the request instance.
   */
  type(): RequestTypes {
    return RequestTypes.ActionRequest;
  }

  /**
   * Get the action instance for the request or abort.
   */
  public action(): Action {
    const action = this.resource()
      .availableActions(this)
      .find((action) => action.uriKey() === this.route('actionName'));

    ActionNotFoundException.when(action === undefined);

    return action as Action;
  }

  /**
   * Get the selected models for the action.
   */
  async models(): Promise<Model[]> {
    const resourceIds = this.query('resources', []);

    return await this.repository()
      .whereKeys(Array.isArray(resourceIds) ? resourceIds : [resourceIds])
      .all();
  }
}
