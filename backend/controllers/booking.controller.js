const jwt = require('jsonwebtoken');

const bookingModel = require('../models/booking.model');

exports.getUserBookings = async (req, res) => {
    try {
        const {userId} = req.params;

        // ✅ Optional: Verify user can only access their own bookings
        if (req.user.id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - You can only access your own bookings'
            });
        }

        const bookings = await bookingModel.getUserBookings(userId);

        return res.json({
            success: true,
            bookings: bookings.map(b => ({
                id: b.id_booking.toString(),
                services: b.services || [],
                ownerName: b.owner_name,
                ownerPhone: b.owner_phone,
                petName: b.pet_name,
                date: b.date,
                time: b.time,
                notes: b.notes,
                status: b.status,
                createdAt: b.created_at
            }))
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};

exports.createBooking = async (req, res) => {
    const connection = await require('../config/db').getConnection();

    try {
        await connection.beginTransaction();

        const {userId, serviceIds, ownerName, ownerPhone, petName, date, time, notes} = req.body;

        // Verify userId matches token
        if (req.user.id.toString() !== userId) {
            console.log('❌ User ID mismatch');
            return res.status(403).json({
                success: false,
                message: 'User ID mismatch - You can only create bookings for yourself'
            });
        }
        
        // VALIDATION
        if (!userId || !serviceIds || !ownerName || !ownerPhone || !petName || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                received: {userId, serviceIds, ownerName, ownerPhone, petName, date, time}
            });
        }

        if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
            console.error('Validation failed - invalid serviceIds');
            return res.status(400).json({
                success: false,
                message: 'serviceIds must be a non-empty array'
            });
        }

        const serviceIdsInt = serviceIds.map(id => Number(id));

        if (serviceIdsInt.some(id => isNaN(id))) {
            console.error('❌ INVALID serviceIds detected:', serviceIds);
            return res.status(400).json({
                success: false,
                message: 'Invalid serviceIds, must be numeric',
                received: serviceIds
            });
        }

        const formattedTime = time.length === 5 ? `${time}:00` : time;

        // INSERT BOOKING
        const [result] = await connection.query(
            `INSERT INTO booking (id_user, owner_name, owner_phone, pet_name, date, time, notes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'not-started')`,
            [userId, ownerName, ownerPhone, petName, date, formattedTime, notes || '']
        );

        const bookingId = result.insertId;

        for (const serviceId of serviceIdsInt) {
            await connection.query(
                'INSERT INTO booking_services (id_booking, id_service) VALUES (?, ?)',
                [bookingId, serviceId]
            );
        }

        await connection.commit();

        const booking = await bookingModel.getBookingById(bookingId);

        return res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: {
                id: booking.id_booking.toString(),
                services: booking.services || [],
                ownerName: booking.owner_name,
                ownerPhone: booking.owner_phone,
                petName: booking.pet_name,
                date: booking.date,
                time: booking.time,
                notes: booking.notes,
                status: booking.status,
                createdAt: booking.created_at
            }
        });
    } catch (error) {
        await connection.rollback();
        return res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const {id} = req.params;

        // Verify booking belongs to user
        const booking = await bookingModel.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.id_user !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - This booking belongs to another user'
            });
        }

        await bookingModel.deleteBooking(id);

        return res.json({
            success: true,
            message: 'Booking canceled successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message
        });
    }
};