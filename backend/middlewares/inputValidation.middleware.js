module.exports = (req, res, next) => {
    const { email, phone, password, confpassword } = req.body;
    const errors = {}

    // REQUIRED CHECK
    if (!email) errors.email = 'Email wajib diisi';
    if (!phone) errors.phone = 'Phone Number wajib diisi';
    if (!password) errors.password = 'Password wajib diisi';
    if (!confpassword) errors.confpassword = 'Password confirmation wajib diisi';
    
    if (Object.keys(errors).length > 0){
        return res.status(400).json({
            success: false,
            errors
        });
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud)\.[^\s@]+$/i;
    if (!emailRegex.test(email)){
        errors.email = 'Email must be valid (@gmail, @yahoo, dll)';
    }

    // PHONE VALIDATION
    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(phone)) {
        errors.phone = 'Phone number must consist of 10-13 digits';
    }

    // PASSWORD VALIDATION
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    
    if (!hasUpper) errors.password = 'Password must have uppercase letters';
    if (!hasLower) errors.password = 'Password must have lowercase letters';
    if (!hasNumber) errors.password = 'Password must have numbers';
    if (!hasSymbol) errors.password = 'Password must have symbols';

    // CONFIRM PASSWORD VALIDATION
    if (password !== confpassword) {
        errors.confpassword = 'Password confirmation must be the same as password';
    }

    // FINAL CHECK
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
}