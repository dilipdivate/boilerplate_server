const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
// const job = require('./schedulers');
const { logger } = require('./config/logger');
const Role = require('./models/role.model');

mongoose.set('strictQuery', false);

const initial = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      // console.log('Dilip Count: ', count);
      new Role({
        name: 'user',
      }).save((error) => {
        if (error) {
          logger.error(`${error}`)
        }
        logger.info(`added 'user' to roles collection `);
      });

      new Role({
        name: 'moderator',
      }).save((error) => {
        if (error) {
          logger.error(`${error}`)
        }
        logger.info(`added 'moderator' to roles collection `);
      });

      new Role({
        name: 'admin',
      }).save((error) => {
        if (error) {
          logger.error(`${error}`)
        }
        logger.info(`added 'admin' to roles collection `);
      });
    }
  });
};

let server;
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info(`Connected to MongoDB successfully on ${config.mongoose.url} `);
    initial();
    server = app.listen(config.port, () => {
      logger.info(`Server started and running on ${config.host}:${config.port}`);
    });
  })
  .catch((error) => logger.error(`Not Connected to Database ERROR! ${error}`));

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
