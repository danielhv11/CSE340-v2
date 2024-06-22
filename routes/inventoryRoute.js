// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const regValidate = require('../utilities/classification-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to deliver the inventory item detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

// Route to intentionally trigger a 500 error
router.get("/serverError",invController.serverError)

// route for management
router.get("/", utilities.handleErrors(invController.buildByManagementId));

router.get("/addclassification", utilities.handleErrors(invController.buildByAddClassification));

router.get("/addinventory", utilities.handleErrors(invController.buildByAddInventory));

router.post(
    "/addclassification",  
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.post(
    "/addinventory", 
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)



module.exports = router;