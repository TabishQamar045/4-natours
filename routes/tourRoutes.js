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

// Basic routes
router.get('/', getAllTours);
router.post('/', createTour);
router.get('/:id', getTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);

// Special routes
router.get('/top-5-cheap', aliasTopTours, getAllTours);
router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);

module.exports = router;
