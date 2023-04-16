import Response from './Response';

export default class ErrorResponse extends Response {
  constructor(
    public code: number = 500,
    protected name: string,
    protected message: string,
    protected error?: Error,
  ) {
    super(code);
  }

  /**
   * Get content for response.
   */
  public content(): Record<string, any> {
    return {
      code: this.code,
      message: this.message,
      name: this.name,
      meta: {
        ...this.meta,
        stack: this.error,
      },
    };
  }
}
