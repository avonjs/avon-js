import Joi from 'joi';
import Text from './Text';
export default class Email extends Text {
    /**
     * The validation rules callback for creation and updates.
     */
    protected rulesSchema: Joi.StringSchema<string>;
    /**
     * The validation rules callback for creation.
     */
    protected creationRulesSchema: Joi.StringSchema<string>;
    /**
     * The validation rules callback for updates.
     */
    protected updateRulesSchema: Joi.StringSchema<string>;
}
//# sourceMappingURL=Email.d.ts.map