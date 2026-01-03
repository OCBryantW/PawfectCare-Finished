const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
// const serviceMiddleware = require("../middlewares/service.middleware")
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.get("/:id/testimonials", serviceController.getTestimonials);

router.post("/validService", authMiddleware, (req, res) => {
  res.json({ test: "Service ROUTE OK" });
});

module.exports = router;
