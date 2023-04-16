import Response from './Response';
export default class ErrorResponse extends Response {
    code: number;
    protected name: string;
    protected message: string;
    protected error?: Error | undefined;
    constructor(code: number, name: string, message: string, error?: Error | undefined);
    /**
     * Get content for response.
     */
    content(): Record<string, any>;
}
//# sourceMappingURL=ErrorResponse.d.ts.map