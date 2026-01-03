const db = require('../config/db');

async function getUserBookings(userId) {
    const [bookings] = await db.query(
        `SELECT 
            b.id_booking,
            b.id_user,
            b.owner_name,
            b.owner_phone,
            b.pet_name,
            b.date,
            b.time,
            b.notes,
            b.status,
            b.created_at,
            GROUP_CONCAT(s.id_service) as service_ids,
            GROUP_CONCAT(s.service_name) as service_names,
            GROUP_CONCAT(s.duration) as service_durations,
            GROUP_CONCAT(s.service_price) as service_prices,
            GROUP_CONCAT(s.image) as service_images
        FROM booking b
        LEFT JOIN booking_services bs ON b.id_booking = bs.id_booking
        LEFT JOIN services s ON bs.id_service = s.id_service
        WHERE b.id_user = ?
        GROUP BY b.id_booking
        ORDER BY b.created_at DESC`,
        [userId]
    );

    return bookings.map(b => ({
        id_booking: b.id_booking,
        id_user: b.id_user,
        owner_name: b.owner_name,
        owner_phone: b.owner_phone,
        pet_name: b.pet_name,
        date: b.date,
        time: b.time,
        notes: b.notes,
        status: b.status,
        created_at: b.created_at,
        services: b.service_ids ? b.service_ids.split(',').map((id, index) => ({
            id: id.toString(), // Convert INT to string for frontend
            name: b.service_names.split(',')[index],
            duration: b.service_durations.split(',')[index],
            price: parseInt(b.service_prices.split(',')[index]),
            image: b.service_images.split(',')[index]
        })) : []
    }));
}

async function getBookingById(id) {
    const [bookings] = await db.query(
        `SELECT 
            b.id_booking,
            b.id_user,
            b.owner_name,
            b.owner_phone,
            b.pet_name,
            b.date,
            b.time,
            b.notes,
            b.status,
            b.created_at,
            GROUP_CONCAT(s.id_service) as service_ids,
            GROUP_CONCAT(s.service_name) as service_names,
            GROUP_CONCAT(s.duration) as service_durations,
            GROUP_CONCAT(s.service_price) as service_prices,
            GROUP_CONCAT(s.description) as service_descriptions,
            GROUP_CONCAT(s.image) as service_images
        FROM booking b
        LEFT JOIN booking_services bs ON b.id_booking = bs.id_booking
        LEFT JOIN services s ON bs.id_service = s.id_service
        WHERE b.id_booking = ?
        GROUP BY b.id_booking`,
        [id]
    );

    if (bookings.length === 0) return null;

    const booking = bookings[0];
    return {
        id_booking: booking.id_booking,
        id_user: booking.id_user,
        owner_name: booking.owner_name,
        owner_phone: booking.owner_phone,
        pet_name: booking.pet_name,
        date: booking.date,
        time: booking.time,
        notes: booking.notes,
        status: booking.status,
        created_at: booking.created_at,
        services: booking.service_ids ? booking.service_ids.split(',').map((id, index) => ({
            id: id.toString(), // Convert INT to string for frontend
            name: booking.service_names.split(',')[index],
            duration: booking.service_durations.split(',')[index],
            price: parseInt(booking.service_prices.split(',')[index]),
            description: booking.service_descriptions.split(',')[index],
            image: booking.service_images.split(',')[index]
        })) : []
    };
}

async function deleteBooking(id) {
    await db.query('DELETE FROM booking_services WHERE id_booking = ?', [id]);
    await db.query('DELETE FROM booking WHERE id_booking = ?', [id]);
}

module.exports = {
    getUserBookings,
    getBookingById,
    deleteBooking
};