const winston = require('winston');
const path = require('path');

// 创建日志记录器
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        // 控制台输出
        new winston.transports.Console(),
        // 文件输出
        new winston.transports.File({
            filename: path.join(__dirname, '../../log/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../log/combined.log')
        })
    ]
});

module.exports = { logger };