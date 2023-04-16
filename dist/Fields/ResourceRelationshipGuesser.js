"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessRelation = exports.guessForeignKey = void 0;
const pluralize_1 = require("pluralize");
/**
 * Guess foreign-key name for the given resource.
 */
const guessForeignKey = (resource) => {
    const keyname = resource.constructor.name.replace(/[A-Z]/g, (matched, offset) => (offset > 0 ? '_' : '') + matched.toLowerCase());
    return keyname + '_id';
};
exports.guessForeignKey = guessForeignKey;
/**
 * Guess relation name for the given resource.
 */
const guessRelation = (resource, pluralize = false) => {
    const relation = resource.constructor.name.replace(/[A-Z]/g, (matched, offset) => (offset > 0 ? matched : matched.toLowerCase()));
    return pluralize ? (0, pluralize_1.plural)(relation) : (0, pluralize_1.singular)(relation);
};
exports.guessRelation = guessRelation;
