import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
     // here we just keep it simple, in the real world we would use userID or an actual IP address.
    // userId or IP based rate limiting
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).send("Too many requests, please try again later");
    }

    next(); // Allow request to proceed
  } catch (error) {
    console.error("Rate limiting error:", error);
    next(error); // Forward error to Express error handler
  }
};

export default rateLimiter;
