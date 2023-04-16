import { AvonRequest, RequestTypes } from '.';

export default class ResourceCreateOrAttachRequest extends AvonRequest {
  /**
   * Indicates type of the request instance.
   */
  type(): RequestTypes {
    return RequestTypes.ResourceCreateOrAttachRequest;
  }
}
