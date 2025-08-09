const express = require('express');
const morgan = require('morgan');
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// Handle unmatched routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(errorController);

module.exports = app;
