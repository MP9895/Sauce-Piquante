const rateLimit = require('express-rate-limit'); 

// Restrict road to only 5 requests per IP address every 10 minutes
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,    // 10 minutes
    max: 5,                     // limit requests per IP
    message: 'Too many requests, please try again after 10 minutes',
});

module.exports = limiter;