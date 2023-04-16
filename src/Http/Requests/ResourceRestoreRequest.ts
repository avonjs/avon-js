import { AvonRequest, RequestTypes } from '.';

export default class ResourceRestoreRequest extends AvonRequest {
  /**
   * Indicates type of the request instance.
   */
  type(): RequestTypes {
    return RequestTypes.ResourceRestoreRequest;
  }
}
