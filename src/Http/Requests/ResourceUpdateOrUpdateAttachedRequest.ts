import { AvonRequest, RequestTypes } from '.';

export default class ResourceUpdateOrUpdateAttachedRequest extends AvonRequest {
  /**
   * Indicates type of the request instance.
   */
  type(): RequestTypes {
    return RequestTypes.ResourceUpdateOrUpdateAttachedRequest;
  }
}
