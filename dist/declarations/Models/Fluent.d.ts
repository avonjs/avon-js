import Model from './Model';
export default class Fluent extends Model {
    protected attributes: Record<any, any>;
    [key: string]: any;
    constructor(attributes?: Record<any, any>);
    /**
     * Set value for the given key.
     */
    setAttribute(key: string, value: any): this;
    /**
     * Get value for the given key.
     */
    getAttribute(key: string): any;
    /**
     * Get the model key.
     */
    getKey(): any;
    /**
     * Get primary key name of the model.
     */
    getKeyName(): string;
    /**
     * Return all the attributes.
     */
    all(): Record<string, any>;
    /**
     * Conver attributes to JSON string.
     */
    toJson(): string;
}
//# sourceMappingURL=Fluent.d.ts.map