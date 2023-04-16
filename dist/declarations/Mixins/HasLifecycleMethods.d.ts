import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Register a callback to be called before the resource create.
         */
        beforeCreate(request: AvonRequest): void;
        /**
         * Register a callback to be called after the resource is created.
         */
        afterCreate(request: AvonRequest): void;
        /**
         * Register a callback to be called before the resource update.
         */
        beforeUpdate(request: AvonRequest): void;
        /**
         * Register a callback to be called after the resource is updated.
         */
        afterUpdate(request: AvonRequest): void;
        /**
         * Register a callback to be called before the resource delete.
         */
        beforeDelete(request: AvonRequest): void;
        /**
         * Register a callback to be called after the resource is destroyed.
         */
        afterDelete(request: AvonRequest): void;
        /**
         * Register a callback to be called before the resource force-destroyed.
         */
        beforeForceDelete(request: AvonRequest): void;
        /**
         * Register a callback to be called after the resource is force-destroyed.
         */
        afterForceDelete(request: AvonRequest): void;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=HasLifecycleMethods.d.ts.map