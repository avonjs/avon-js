import { AvonRequest, RequestTypes } from '.';

export default class ResourceDetailRequest extends AvonRequest {
  /**
   * Indicates type of the request instance.
   */
  type(): RequestTypes {
    return RequestTypes.ResourceDetailRequest;
  }
}
