// Packages
const express = require('express');
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const app = express();

const morgan = require('morgan');
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));
app.use((req, res, next) => {
  console.log(`Hello from the middleware`);
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
