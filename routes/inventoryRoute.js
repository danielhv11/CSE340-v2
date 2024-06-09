// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to deliver the inventory item detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

// Route to intentionally trigger a 500 error
router.get("/serverError",invController.serverError)

module.exports = router;