const firebaseAdmin = require("./_firebase.js");

// Middleware for requiring authentication and getting user
const requireAuth = (fn) => async (event, context, callback) => {
  // Respond with error if no authorization header
  if (!event.headers.authorization) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        status: "error",
        message: "You must be signed in to call this endpoint",
      }),
    });
  }

  // Get access token from authorization header ("Bearer: xxxxxxx")
  const accessToken = event.headers.authorization.split(" ")[1];

  try {
    // Get user from token and add to event object
    event.user = await firebaseAdmin.auth().verifyIdToken(accessToken);

    // Call route function passed into this middleware
    return fn(event, context, callback);
  } catch (error) {
    console.log("_require-auth error", error);

    // If there's an error assume token is expired and return
    // auth/invalid-user-token error (handled by apiRequest in util.js)
    callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        status: "error",
        code: "auth/invalid-user-token",
        message: "Your login has expired. Please login again.",
      }),
    });
  }
};

module.exports = requireAuth;
