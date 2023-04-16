"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Model_1 = tslib_1.__importDefault(require("./Model"));
class Fluent extends Model_1.default {
    constructor(attributes = {}) {
        super();
        this.attributes = attributes;
        return new Proxy(this, {
            get: function (parent, property, receiver) {
                // handle exists method
                if (property in parent) {
                    return parent[property];
                }
                return parent.getAttribute(property);
            },
            set: (model, key, value) => {
                model.setAttribute(key, value ?? true);
                return true;
            },
        });
    }
    /**
     * Set value for the given key.
     */
    setAttribute(key, value) {
        this.attributes[key] = value;
        return this;
    }
    /**
     * Get value for the given key.
     */
    getAttribute(key) {
        return this.attributes[key];
    }
    /**
     * Get the model key.
     */
    getKey() {
        return this.getAttribute(this.getKeyName());
    }
    /**
     * Get primary key name of the model.
     */
    getKeyName() {
        return 'id';
    }
    /**
     * Return all the attributes.
     */
    all() {
        return this.attributes;
    }
    /**
     * Conver attributes to JSON string.
     */
    toJson() {
        return JSON.stringify(this.all());
    }
}
exports.default = Fluent;
