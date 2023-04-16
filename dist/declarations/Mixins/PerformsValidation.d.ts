import { type AnySchema } from 'joi';
import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';
export type Rules = Record<string, AnySchema>;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Validate a resource creation request.
         *
         * @throws ValidationException
         */
        validateForCreation(request: AvonRequest): Promise<any>;
        /**
         * Create a validator instance for a resource creation request.
         */
        validatorForCreation(request: AvonRequest): AnySchema;
        /**
         * Get the validation rules for a resource creation request.
         */
        rulesForCreation(request: AvonRequest): AnySchema[];
        /**
         * Validate a resource update request.
         *
         * @throws \Illuminate\Validation\ValidationException
         */
        validateForUpdate(request: AvonRequest): Promise<any>;
        /**
         * Create a validator instance for a resource update request.
         */
        validatorForUpdate(request: AvonRequest): AnySchema;
        /**
         * Get the validation rules for a resource update request.
         */
        rulesForUpdate(request: AvonRequest): AnySchema[];
        /**
         * Preapare given rules for validator.
         */
        prepareRuelsForValidator(rules: Rules[]): AnySchema[];
        /**
         * Perform any final formatting of the given validation rules.
         */
        formatRules(request: AvonRequest, rules: AnySchema[]): AnySchema[];
        /**
         * Handle any post-validation processing.
         */
        afterValidation(request: AvonRequest, validator: any): any;
        /**
         * Handle any post-creation validation processing.
         */
        afterCreationValidation(request: AvonRequest, validator: any): any;
        /**
         * Handle any post-update validation processing.
         */
        afterUpdateValidation(request: AvonRequest, validator: any): any;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=PerformsValidation.d.ts.map