import Response from './Response';

export default class ResourceAssociationResponse extends Response {
  constructor(
    data: Array<Record<string, any>>,
    meta: Record<string, any> = {},
  ) {
    super(200, data, meta);
  }
}
