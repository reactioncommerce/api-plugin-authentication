import SimpleSchema from "simpl-schema";

const inputSchema = new SimpleSchema({
  email: {
    type: String,
    optional: true
  },
  userId: String
});

/**
 * @name authentication/startIdentityEmailVerification
 * @memberof Mutations/Authentication
 * @summary Start an email verification by generating a token, saving it to the user
 *   record, and returning it. This mutation is only intended to be called internally
 *   by other plugins.
 * @param {Object} context - App context
 * @param {Object} input - Input arguments
 * @param {String} input.email - Email address to verify. Must be an address the user has.
 * @param {String} input.userId - The user ID
 * @return {Promise<Object>} Object with `token` key
 */
export default async function startIdentityEmailVerification(context, input) {
  inputSchema.validate(input);
  const { email } = input;
  return { email, token: 'random-token' + Date.now() };
}
