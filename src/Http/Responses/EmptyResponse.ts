import Response from './Response';

export default class EmptyResponse extends Response {
  constructor(meta: Record<string, any> = {}) {
    super(204, {}, meta);
  }
}
