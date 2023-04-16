import Response from './Response';

export default class ResourceDetailResponse extends Response {
  constructor(data: Record<any, any>, meta: Record<string, any> = {}) {
    super(200, data, meta);
  }
}
