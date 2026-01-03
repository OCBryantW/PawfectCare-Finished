const db = require('../config/db');

// INSERT NEW USER
async function addNewUser(full_name, phone, email, password) {
    const [result] = await db.query(
        `INSERT INTO auth_user (full_name, phone, email, password)
        VALUES (?, ?, ?, ?)`,
        [full_name, phone, email, password]
    );
    return result;
}

// FIND USER BY EMAIL AND PASSWORD - TIDAK DIPAKAI LAGI
async function findUser(email, password) {
    const [result, fields] = await db.query(
        `SELECT id_user, full_name, phone, email
        FROM auth_user
        WHERE email = ? AND password = ?`,
        [email, password]
    );
    return result;
}

async function findUserByEmail(email){
    const [result] = await db.query(
        `SELECT id_user, full_name, phone, email
        FROM auth_user
        WHERE email = ?`,
        [email]
    );
    return result;
}

async function findUserByEmailWithPassword(email) {
    const [result] = await db.query(
        `SELECT id_user, full_name, phone, email, password
        FROM auth_user
        WHERE email = ?`,
        [email]
    );
    return result;
}

async function findUserById(id) {
    const [result] = await db.query(
        `SELECT id_user, full_name, phone, email
        FROM auth_user
        WHERE id_user = ?`,
        [id]
    );
    return result[0];
}

module.exports = {
    addNewUser,
    findUser,
    findUserByEmail,
    findUserByEmailWithPassword,
    findUserById
};