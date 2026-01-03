// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const bookingMiddleware = req.headers.booking;

//     if (!bookingMiddleware) {
//         return res.status(401).json({
//             success: false,
//             message: 'Token tidak ditemukan'
//         });
//     }

//     const token = bookingMiddleware.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Format token salah'
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // ← simpan user dari token
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Token invalid atau expired'
//         });
//     }
// }