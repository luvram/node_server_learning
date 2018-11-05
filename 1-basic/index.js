const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:startup');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // body가 x-www-form-urlencoded 일 경우에 파싱해준다.
app.use(express.static('public', {extensions: ['txt']})); // 
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);


// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: '+ config.get('mail.password'));

if( app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

debug('Connected to the database...');

app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${process.env.PORT}...`));