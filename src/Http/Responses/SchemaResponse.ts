import Response from './Response';

export default class SchemaResponse extends Response {
  constructor(data: Record<any, any>, meta: Record<string, any> = {}) {
    super(200, data, meta);
  }

  /**
   * Get content for response.
   */
  public content(): Record<string, any> {
    return this.data;
  }
}
