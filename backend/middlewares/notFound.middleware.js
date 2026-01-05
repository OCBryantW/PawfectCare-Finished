module.exports = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route Not Found',
        path: req.originalUrl
    });
}