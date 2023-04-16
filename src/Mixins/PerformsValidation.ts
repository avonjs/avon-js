import Joi, { type AnySchema } from 'joi';

import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';
import ValidationException from '../Exceptions/ValidationException';
import collect from 'collect.js';

export type Rules = Record<string, AnySchema>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable>(Parent: Tbase) => {
  return class PerformsValidation extends Parent {
    /**
     * Validate a resource creation request.
     *
     * @throws ValidationException
     */
    public async validateForCreation(request: AvonRequest): Promise<any> {
      await this.validatorForCreation(request)
        .validateAsync(request.all(), { abortEarly: false })
        .then((value) => this.afterCreationValidation(request, value))
        .catch((error) => {
          ValidationException.throw(error);
        });
    }

    /**
     * Create a validator instance for a resource creation request.
     */
    public validatorForCreation(request: AvonRequest): AnySchema {
      return Joi.object(this.rulesForCreation(request));
    }

    /**
     * Get the validation rules for a resource creation request.
     */
    public rulesForCreation(request: AvonRequest): AnySchema[] {
      return this.formatRules(
        request,
        this.prepareRuelsForValidator(
          request
            .newResource()
            .creationFields(request)
            .flatMap((field) => field.getCreationRules(request))
            .all(),
        ),
      );
    }

    /**
     * Validate a resource update request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public async validateForUpdate(request: AvonRequest): Promise<any> {
      await this.validatorForUpdate(request)
        .validateAsync(request.all(), { abortEarly: false })
        .then((value) => this.afterUpdateValidation(request, value))
        .catch((error) => {
          ValidationException.throw(error);
        });
    }

    /**
     * Create a validator instance for a resource update request.
     */
    public validatorForUpdate(request: AvonRequest): AnySchema {
      return Joi.object(this.rulesForUpdate(request));
    }

    /**
     * Get the validation rules for a resource update request.
     */
    public rulesForUpdate(request: AvonRequest): AnySchema[] {
      return this.formatRules(
        request,
        this.prepareRuelsForValidator(
          request
            .newResource()
            .creationFields(request)
            .map((field) => field.getUpdateRules(request))
            .all(),
        ),
      );
    }

    /**
     * Preapare given rules for validator.
     */
    public prepareRuelsForValidator(rules: Rules[]): AnySchema[] {
      return collect(rules)
        .flatMap((rules) => Object.keys(rules).map((key) => [key, rules[key]]))
        .mapWithKeys<AnySchema>((rules: [string, AnySchema]) => rules)
        .all();
    }

    /**
     * Perform any final formatting of the given validation rules.
     */
    public formatRules(request: AvonRequest, rules: AnySchema[]): AnySchema[] {
      return rules;
    }

    /**
     * Handle any post-validation processing.
     */
    public afterValidation(request: AvonRequest, validator: any): any {
      //
    }

    /**
     * Handle any post-creation validation processing.
     */
    public afterCreationValidation(request: AvonRequest, validator: any): any {
      //
    }

    /**
     * Handle any post-update validation processing.
     */
    public afterUpdateValidation(request: AvonRequest, validator: any): any {
      //
    }
  };
};
