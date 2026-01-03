console.log("AUTH ROUTES FILE LOADED");

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", authController.addNewUser);
router.post('/login', authController.findUser);

router.post('/valid', authMiddleware, (req, res) => {
    res.json({ test: 'LOGIN ROUTE OK' });
})


module.exports = router;
