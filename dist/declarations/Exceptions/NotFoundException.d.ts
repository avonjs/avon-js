import ResponsableException from './ResponsableException';
export default class NotFoundException extends ResponsableException {
    /**
     * Get the response code
     */
    getCode(): number;
    /**
     * Get the exception name
     */
    getName(): string;
}
//# sourceMappingURL=NotFoundException.d.ts.map