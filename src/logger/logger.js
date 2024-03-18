const log4js = require('log4js')


//logger.level = 'debug'

log4js.configure({
    appenders: {
        out: {
            type: 'stdout'
        },
        app: {
            type: 'file',
            filename: './logs/runtime.log', // cannot name server.log due to azure conflicts
            maxLogSize: 10485760,
            backups: 1,
            compress: true
        },
        apiError: {
            type: "file",
            filename: "./logs/apiError.log"
        },
        api: {
            type: "file",
            filename: "./logs/api.log"
        }

    },
    categories: {
        default: {
            appenders: ['out', 'app'],
            level: "trace"
        },
        api: {
            appenders: ['apiError', 'out', 'api'],
            level: "trace"
        }
    }
})

//logger.debug('logger level on debug')
const logger = log4js.getLogger()
module.exports = logger