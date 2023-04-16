import type Ordering from '../Orderings/Ordering';
import { type AvonRequest } from '../Http/Requests';
import type Repository from '../Repositories/Repository';
import { type AbstractMixable, type Mixable } from './Mixable';
import { type Model } from '../Models';
export type OrderingCallback = (request: AvonRequest, repository: Repository<Model>, value: any) => any;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => (abstract new (...args: any[]) => {
    /**
     * The callback to be used for the field's default value.
     */
    orderableCallback?: OrderingCallback | undefined;
    /**
     * Apply the order to the given query.
     */
    applyOrdering(request: AvonRequest, repository: Repository<Model>, value: any): any;
    /**
     * Make the field order.
     */
    resolveOrdering(request: AvonRequest): Ordering | undefined;
    /**
     * The callback used to determine if the field is orderable.
     */
    orderable(callback?: OrderingCallback): this;
    /**
     * Define the default orderable callback.
     */
    defaultOrderingCallback(): OrderingCallback;
    /**
     * Make the field order.
     */
    makeOrdering(request: AvonRequest): Ordering;
    /**
     * Define orderable attribute.
     */
    orderableAttribute(request: AvonRequest): string;
}) & Tbase;
export default _default;
//# sourceMappingURL=Orderable.d.ts.map