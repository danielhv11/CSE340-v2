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

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inventory_id", utilities.checkUserRole, utilities.handleErrors(invController.buildEditor));

router.get("/delete/:inventory_id", utilities.checkUserRole, utilities.handleErrors(invController.buildByDelete));



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


router.post("/update/", 
    utilities.checkUserRole, 
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))



router.post("/delete/", 
    utilities.checkUserRole, 
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;