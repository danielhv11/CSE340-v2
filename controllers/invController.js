const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// Controller function to get inventory item detail
invCont.buildByInventoryId = async function(req, res, next) {
  const inventory_id = req.params.inventoryId
  const vehicle = await invModel.getVehicleByInventoryId(inventory_id)
  let details = await utilities.buildVehicleDetails(vehicle)
  let nav = await utilities.getNav()
  const makeModel = vehicle.inv_make + " " + vehicle.inv_model
  let showOrderButton = false
  if(res.locals.loggedIn && vehicle.inv_stock > 0) showOrderButton = true
  res.render("./inventory/details", {
      title: makeModel + " details",
      nav,
      details,
      showOrderButton,
      makeModel,
      inventory_id,
  })
}

// Controller function to intentionally trigger a 500 error
invCont.serverError = (req, res, next) => {
  // Creating an error object
  const error = new Error("sorry");
  // Passing the error to the next middleware
  next(error);
}

module.exports = invCont