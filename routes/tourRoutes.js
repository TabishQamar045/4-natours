const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const router = express.Router();

// router.param('id', checkId);


// Aliased routes
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// Stats routes
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// Standard routes
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
