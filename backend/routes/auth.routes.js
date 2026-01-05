console.log("AUTH ROUTES FILE LOADED");

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const inputValidationMiddleware = require("../middlewares/inputValidation.middleware");

router.post("/register", inputValidationMiddleware, authController.addNewUser);
router.post('/login', inputValidationMiddleware, authController.findUser);

router.post('/valid', authMiddleware, (req, res) => {
    res.json({ test: 'LOGIN ROUTE OK' });
})


module.exports = router;
