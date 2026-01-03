const jwt = require('jsonwebtoken');

const serviceModel = require('../models/service.model')

exports.getAllServices = async (req, res) => {
    try {
        const services = await serviceModel.getAllServices();
        return res.json({
            success: true,
            services: services.map(s => ({
                id: s.id_service.toString(),
                name: s.service_name,
                duration: s.duration,
                price: s.service_price,
                description: s.description,
                longDescription: s.long_desc,
                image: s.image
            }))
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const {id} = req.params;
        const service = await serviceModel.getServiceById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            })
        }

        return res.json({
            success: true,
            services: {
                id: service.id_service.toString(),
                name: service.service_name,
                duration: service.duration,
                price: service.service_price,
                description: service.description,
                longDescription: service.long_desc,
                image: service.image
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch service',
            error: error.message
        });
    }
};

exports.getTestimonials = async (req, res) => {
    try {
        const {id} = req.params;

        const testimonials = await serviceModel.getTestimonials(id);

        return res.json({
            success: true,
            testimonials: testimonials.map(t => ({
                id: t.id_testimoni.toString(),
                name: t.user_name,
                rating: t.rating,
                comment: t.user_comment,
                date: t.created_at,
            }))
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
            error: error.message
        });
    }
};