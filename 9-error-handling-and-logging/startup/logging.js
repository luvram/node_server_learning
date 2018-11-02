const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function () {
    winston.exitOnError = false;
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );
    process.on('unhandledRejection', (e) => {
        // console.log('WE GOT AN UNHANDLED EXCEPTION');
        // winston.error({ message: e.message, meta: e });
        throw e;

    });
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
    winston.add(new winston.transports.File({
        filename: 'logfile.log'
    }));
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        level: 'error',
    }));
};

// process.on('uncaughtException', (e) => {
//   console.log('WE GOT AN UNCAUGHT EXCEPTION');
//   winston.error({ message: e.message, meta: e });
// });

// throw new Error('Something failed during startup.'); // uncaughtException

// const p = Promise.reject(new Error('Something failed miserably!')); 
// p.then(() => console.log('Done')); // unhandledRejection
