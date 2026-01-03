const jwt = require('jsonwebtoken');

const { json } = require('express');
const authModel = require('../models/auth.model')
const bcrypt = require('bcrypt');

exports.addNewUser = async (req, res) => {
    try{
        const {full_name, phone, email, password} = req.body;

        if (!full_name || !phone || !email || !password){
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi'
            });
        }

        const existingUser = await authModel.findUserByEmail(email);

        if (existingUser.length > 0){
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await authModel.addNewUser(
            full_name,
            phone,
            email,
            hashedPassword
        );

        const newUser = await authModel.findUserById(result.insertId);

        return res.status(201).json({
            success: true,
            message: 'User berhasil register',
            user: {
                id: newUser.id_user.toString(),
                fullName: newUser.full_name,
                phone: newUser.phone,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: err.message
        });
    }
};

exports.findUser = async (req, res) =>  {
    try {
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }

        const users = await authModel.findUserByEmailWithPassword(email);

        if (users.length == 0){
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // GENERATE JWT
        const token = jwt.sign(
            {
                id: user.id_user,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: {
                id: user.id_user.toString(),
                fullName: user.full_name,
                phone: user.phone,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: err.message
        });
    }
};