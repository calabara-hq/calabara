const { createLogger, format, transports } = require('winston');
const { combine, timestamp } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        format.json(),
    ),
    defaultMeta: { service: 'backend' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}




module.exports = logger;