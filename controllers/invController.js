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

// Controller function to build the inventory management view

invCont.buildByManagementId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildByAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/addclassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const insertResult = await invModel.addClassification(classification_name)

  if (insertResult) {
    nav = await utilities.getNav()
    req.flash("notice", `The ${insertResult.classification_name} classification was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/addclassification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.buildByAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/addinventory", {
    title: "Add New Vehicle",
    nav,
    list,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    const insertResult = await invModel.addInventory(
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    )

    if (insertResult) {
      nav = await utilities.getNav()
      req.flash("notice", `The Inventory was successfully added.`)
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the insert failed.")
      let list = await utilities.buildClassificationList()
      res.status(501).render("inventory/addinventory", {
        title: "Add New Vehicle",
        nav,
        list,
        errors: null,
      })
    }
}




module.exports = invCont