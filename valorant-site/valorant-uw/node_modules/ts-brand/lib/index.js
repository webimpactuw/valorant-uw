"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.make = exports.identity = void 0;
/**
 * A generic function that, when given some branded type, can take a value with
 * the base type of the branded type, and cast that value to the branded type.
 * It fulfills the contract of a `Brander`.
 *
 * At runtime, this function simply returns the value as-is.
 *
 * @param underlying The value with a base type, to be casted
 * @return The same underlying value, but casted
 * @example
 * ```
 * type UserId = Brand<number, 'user'>;
 * const UserId: Brander<UserId> = identity;
 * ```
 */
function identity(underlying) {
    return underlying;
}
exports.identity = identity;
/**
 * Produces a `Brander<B>`, given a brand type `B`. By default this returns
 * `identity` and relies on type inference to give the return type the correct
 * type. Optionally, `validator` can be used to assert on the value.
 *
 * @example
 * ```
 * type UserId = Brand<number, 'user'>;
 * const UserId = make<UserId>();
 * const myUserId = UserId(42);
 * ```
 * @example
 * ```
 * type UserId = Brand<number, 'user'>;
 * const UserId = make<UserId>((value) => {
 *   if (value <= 0) {
 *     throw new Error(`Non-positive value: ${value}`);
 *   }
 * });
 * UserId(42); // Ok
 * UserId(-1); // Error: Non-positive value: -1
 * ```
 */
function make(validator) {
    if (!validator) {
        return identity;
    }
    return function (underlying) {
        validator(underlying);
        return underlying;
    };
}
exports.make = make;
