export default abstract class Response {
    code: number;
    data: Record<string | number, any>;
    meta: Record<string, any>;
    /**
     * Indicates custom headers.
     */
    protected headers: Record<string, any>;
    constructor(code: number, data?: Record<string | number, any>, meta?: Record<string, any>);
    /**
     * Merge the given meta into the response meta.
     */
    withMeta(meta: string | Record<string, any>, value?: any): Response;
    /**
     * Get content for response.
     */
    content(): Record<string, any>;
    /**
     * Get response status code.
     */
    getStatusCode(): number;
    /**
     * Get the response headers.
     */
    getHeaders(): Record<string, any>;
    /**
     * Append header value to response.
     */
    withHeader(key: string, value: any): this;
}
//# sourceMappingURL=Response.d.ts.map