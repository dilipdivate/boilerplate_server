const winston = require('winston');
// eslint-disable-next-line import/no-extraneous-dependencies
const correlator = require('express-correlation-id');
const config = require('./config');

// Import mongodb
// eslint-disable-next-line import/no-extraneous-dependencies
require('winston-mongodb');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  // eslint-disable-next-line no-param-reassign
  info.correlationId = correlator.getId();
  return info;
});

const myFormat = winston.format.printf(({ level, message, timestamp, correlationId }) => {
  const msg = `${level}: ${[timestamp]}: (${correlationId}) : ${message}`;
  // if (metadata) {
  //   msg += JSON.stringify(metadata);
  // }
  return msg;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  defaultMeta: { component: 'app-service' },
  format: winston.format.combine(
    enumerateErrorFormat(),
    // config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    winston.format.align(),
    winston.format.errors({ stack: true }),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      level: 'info',
      stderrLevels: ['error'],
      handleExceptions: true,
    }),
    // File transport
    new winston.transports.File({
      level: 'error',
      filename: 'logs/server_logs.log',
    }),
    // MongoDB transport
    new winston.transports.MongoDB({
      level: 'error',
      // mongo database connection link
      db: config.mongoose.url,
      options: config.mongoose.options,
      // A collection to save json formatted logs
      collection: 'server_logs',
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
  exitOnError: false,
});

const usersLogger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  defaultMeta: { component: 'user-service' },
  format: winston.format.combine(
    enumerateErrorFormat(),
    // config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    winston.format.align(),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      level: 'info',
      stderrLevels: ['error'],
      handleExceptions: true,
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/user_logs.log',
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
  exitOnError: false,
});

// module.exports = logger;

module.exports = {
  logger,
  usersLogger,
};
