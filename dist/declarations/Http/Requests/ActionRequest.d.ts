import type Action from '../../Actions/Action';
import { AvonRequest, RequestTypes } from '.';
import { type Model } from '../../Models';
export default class ActionRequest extends AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type(): RequestTypes;
    /**
     * Get the action instance for the request or abort.
     */
    action(): Action;
    /**
     * Get the selected models for the action.
     */
    models(): Promise<Model[]>;
}
//# sourceMappingURL=ActionRequest.d.ts.map