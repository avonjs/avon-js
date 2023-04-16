import { type AvonRequest } from '../Http/Requests';
import type FieldCollection from '../Collections/FieldCollection';
import { type AbstractMixable, type Mixable } from './Mixable';
import { type Model } from '../Models';
export type Callbacks = [Model, Array<() => Promise<any>>];
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Fill a new model instance using the given request.
         */
        fillForCreation<TModel extends Model>(request: AvonRequest, model: TModel): Callbacks;
        /**
         * Fill a new model instance using the given request.
         */
        fillForUpdate<TModel_1 extends Model>(request: AvonRequest, model: TModel_1): Callbacks;
        /**
         * Fill the given fields for the model.
         */
        fillFields<TModel_2 extends Model>(request: AvonRequest, model: TModel_2, fields: FieldCollection): Callbacks;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=FillsFields.d.ts.map