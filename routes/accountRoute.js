const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post("/register", utilities.handleErrors(accountController.registerAccount))
// Route to the account management view
router.get( "/",  utilities.checkLogin, utilities.handleErrors(accountController.buildAccountMgmtView))

router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.processLogout))



// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  // Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin))

 
  router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.updateAccountView));

router.post("/update", 
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData, 
  utilities.handleErrors(accountController.updateAccount))

  router.post("/update-password",
    utilities.checkLogin,
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.updatePassword)
)



module.exports = router;