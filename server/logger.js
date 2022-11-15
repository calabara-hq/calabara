const { createLogger, format, transports } = require('winston');
const { combine, timestamp } = format;

const logFormat = format.printf(data => `${data.timestamp} ${data.level} [${data.service}]: ${data.message}`)

const logger = createLogger({
    level: 'info',
    format: combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    ),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: format.combine(
                format.json()
            )
        }),
        new transports.File({
            filename: 'combined.log',
            format: format.combine(
                format.json()
            )
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            logFormat
        )
    }));
}




module.exports = logger;