import rateLimit from 'express-rate-limit';

const threadsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 90, // limit each IP to 90 requests per windowMs
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after a minute',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      status: 'fail',
      message: 'Too many requests from this IP, please try again after a minute',
    });
  },
});

export default threadsLimiter;
