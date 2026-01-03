const express = require('express')
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
// const bookingMiddleware = require('../middlewares/booking.middleware');
const authMiddleware = require("../middlewares/auth.middleware");

router.get('/user/:userId', authMiddleware, bookingController.getUserBookings);

router.post('/', authMiddleware, bookingController.createBooking);

router.delete('/:id', authMiddleware, bookingController.cancelBooking);

router.post('/validBooking', authMiddleware, (req, res) => {
    res.json({ test: 'Booking ROUTE OK' });
})

module.exports = router;