import Response from './Response';
export default class SchemaResponse extends Response {
    constructor(data: Record<any, any>, meta?: Record<string, any>);
    /**
     * Get content for response.
     */
    content(): Record<string, any>;
}
//# sourceMappingURL=SchemaResponse.d.ts.map