import Logger from "@reactioncommerce/logger";
import expandAuthToken from "./expandAuthToken.js";

/**
 * Given an Authorization Bearer token and the current context, returns the user document
 * for that token after performing token checks.
 *
 * If the provided token is not associated with any user or is associated but is
 * expired, this function throws an "access-denied" ReactionError.
 *
 * @name getUserFromAuthToken
 * @method
 * @memberof GraphQL
 * @summary Looks up a user by token
 * @param {String} loginToken Auth token
 * @param {Object} context An object with request-specific state
 * @returns {Object} The user associated with the token
 */
async function getUserFromAuthToken(loginToken, context) {
  const token = loginToken.replace(/bearer\s/gi, "");

  const tokenObj = await expandAuthToken(token);
  if (!tokenObj) {
    Logger.debug("No token object");
    throw new Error("No token object");
  }

  const { active, sub: _id, token_type: tokenType, token_use: tokenUse } = tokenObj;

  if (!active) {
    Logger.debug("Bearer token is expired");
    throw new Error("Bearer token is expired");
  }

  if (tokenType !== "Bearer") {
    Logger.error("Bearer token is not an access token");
    throw new Error("Bearer token is not an access token");
  }

  if (tokenUse !== "access_token") {
    Logger.error("Bearer token is not an access token");
    throw new Error("Bearer token is not an access token");
  }

  let currentUser = { _id };
  // Identity provider will provide extra information about user in
  // ext field in initial logins.
  if (tokenObj.ext) {
    const { email, id, name, picture } = tokenObj.ext;
    if (!email || !id || !name) {
      Logger.error("Bearer token does not contain user profile. Such user may not exist in the system.");
      throw new Error("Bearer token does not contain user profile. Such user may not exist in the system.");
    }
    currentUser = {
      ...currentUser,
      name,
      emails: [{ address: email }],
      profile: {
        name,
        picture
      }
    };
  }

  return currentUser;
}

export default getUserFromAuthToken;
