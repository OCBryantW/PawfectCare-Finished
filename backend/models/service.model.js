const db = require('../config/db');

async function getAllServices() {
    const [services] = await db.query(
        'SELECT * FROM services ORDER BY id_service'
    );
    return services;
}

async function getServiceById(id) {
    const [services] = await db.query(
        'SELECT * FROM services WHERE id_service = ?',
        [id]
    );
    return services[0];
}
async function getTestimonials(serviceId) {
    const [testimonials] = await db.query(
        'SELECT * FROM service_testimoni WHERE id_service = ? ORDER BY created_at DESC',
        [serviceId]
    );
    return testimonials;
}

module.exports = {
    getAllServices,
    getServiceById,
    getTestimonials
};