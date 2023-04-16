import { type ValidationError } from 'joi';
import { type AvonRequest } from '../Http/Requests';
import ResponsableException from './ResponsableException';
import type Response from '../Http/Responses/Response';
export default class ValidationException extends ResponsableException {
    protected errors: ValidationError;
    constructor(errors: ValidationError);
    /**
     * Get the response code
     */
    getCode(): number;
    /**
     * Get the exception name
     */
    getName(): string;
    /**
     * Create an HTTP response that represents the object.
     */
    toResponse(request: AvonRequest): Response;
}
//# sourceMappingURL=ValidationException.d.ts.map