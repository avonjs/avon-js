import { type AvonRequest } from '../Http/Requests';
import { type Response } from '../Http/Responses';
import Exception from './Exception';
export default abstract class ResponsableException extends Exception {
    /**
     * Create an HTTP response that represents the object.
     */
    toResponse(request: AvonRequest): Response;
    /**
     * Get the response code
     */
    abstract getCode(): number;
    /**
     * Get the exception name
     */
    abstract getName(): string;
}
//# sourceMappingURL=ResponsableException.d.ts.map