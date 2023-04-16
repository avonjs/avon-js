import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { type Mixable, type AbstractMixable } from './Mixable';
export type PrunCallback = (request: AvonRequest, resource: Model, attribute: string) => any;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => (abstract new (...args: any[]) => {
    [x: string]: any;
    /**
     * The callback used to prunable the field.
     */
    prunUsingCallback: PrunCallback;
    /**
     * Indicates if the underlying field is prunable.
     */
    prunable: boolean;
    /**
     * Specify the callback that should be used to prunable the field.
     */
    prunUsing(prunUsingCallback: PrunCallback): this;
    /**
     * Determine if the underlying file should be pruned when the resource is deleted.
     */
    isPrunable(): boolean;
    /**
     * Specify if the underlying field should be pruned when the resource is deleted.
     */
    withPruning(prunable?: boolean): this;
    /**
     * Handle pruning for the incoming requests.
     */
    forRequest(request: AvonRequest): Promise<PrunCallback>;
    /**
     * Specify the default callback that should be used to prunable the field.
     */
    prunCallback(): PrunCallback;
}) & Tbase;
export default _default;
//# sourceMappingURL=Prunable.d.ts.map