require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:8081'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Request Logger
app.use((req, res, next) => {
    console.log(`\n➡️  ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// ✅ Root Endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Pawfect Care API is running!',
        timestamp: new Date().toISOString()
    });
});

// ✅ 404 Handler
app.use((req, res) => {
    console.log('❌ 404 Not Found:', req.originalUrl);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Server running on:`);
    console.log(`   Local:            http://localhost:${PORT}`);
    console.log(`   Network:          http://192.168.1.4:${PORT}`);
    console.log(`   Android Emulator: http://10.0.2.2:${PORT}`);
    console.log(`\n📍 Available Endpoints:`);
    console.log(`   POST   /api/auth/register      - Register new user`);
    console.log(`   POST   /api/auth/login         - Login user`);
    console.log(`   GET    /api/services           - Get all services`);
    console.log(`   GET    /api/services/:id       - Get service by ID`);
    console.log(`   GET    /api/services/:id/testimonials`);
    console.log(`   GET    /api/bookings/user/:userId`);
    console.log(`   POST   /api/bookings           - Create booking`);
    console.log(`   DELETE /api/bookings/:id       - Cancel booking`);
    console.log(`\n🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`);
    console.log(`💾 Database: ${process.env.DB_NAME || 'Not configured'}`);
    console.log(`${'='.repeat(60)}\n`);
});