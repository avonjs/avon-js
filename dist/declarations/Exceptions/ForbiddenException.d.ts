import ResponsableException from './ResponsableException';
export default class ForbiddenException extends ResponsableException {
    message: string;
    /**
     * Get the response code
     */
    getCode(): number;
    /**
     * Get the exception name
     */
    getName(): string;
}
//# sourceMappingURL=ForbiddenException.d.ts.map