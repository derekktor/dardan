const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
    // 60s
    windowMs: 60 * 1000,
    // 5 login requests max
    max: 5,
    message: {
        message: "Нэг IP address-аас хэтэрхий олон нэвтрэх оролдлого хийгдэж байна. 60с-ийн дараа дахин оролдоно уу"
    },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log")
        res.status(options.statusCode).send(options.message)
    },
    // rate limit info in RateLimit-* headers
    standardHeaders: true,
    // disable X-RateLimit-* headers
    legacyHeaders: false
})

module.exports = loginLimiter;