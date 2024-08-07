const utilities = require(".")
const accountModel = require("../models/account-model")
const {body, validationResult} = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }



  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),
        
        body("account_password", "Password does not meet requirements.")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }),
    ]
}

validate.checkLoginData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

validate.accountUpdateRules = () => {
  return [
      //firstname is required and must be string
      body("account_firstname")
          .trim()
          .escape()
          .isLength({min: 1})
          .withMessage("Please provide a first name."), //send this message on error

      //lastname is required and must be string
      body("account_lastname")
          .trim()
          .escape()
          .isLength({min: 2})
          .withMessage("Please provide a last name."),
      
      //valid email is required and cannot already exist in the DB, unless not changing
      body("account_email")
          .trim()
          .escape()
          .isEmail()
          .normalizeEmail()
          .withMessage("A valid email is required.")
          .custom(async (account_email, {req, location, path}) => {
              const emailExists = await accountModel.checkExistingEmail(account_email)
              const oldAccount = await accountModel.getAccountById(req.body.account_id)
              if (account_email != oldAccount.account_email && emailExists){
                  throw new Error("Email exists. Please log in or use different email")
              }
          }),
  ]
}

validate.checkAccountUpdateData = async (req, res, next) => {
  const {account_email, account_firstname, account_lastname, account_id} = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()){
      let nav = await utilities.getNav()
      res.render("account/update", {
          title: "Update your account",
          nav,
          errors,
          account_email,
          account_firstname,
          account_lastname,
          account_id,
      })
      return
  }
  next()
}

validate.passwordUpdateRules = () => {
  return[
      body("account_password", "Password does not meet requirements.")
          .trim()
          .isStrongPassword({
              minLength: 12,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1,
          })
      ]
}

validate.checkPasswordUpdateData = async (req, res, next) => {
  const accountData = res.locals.accountData
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()){
      let nav = await utilities.getNav()
      res.render("account/update", {
          title: "Update your account",
          nav,
          errors,
          account_email: accountData.account_email,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_id: accountData.account_id,
      })
      return
  }
  next()
}



  module.exports = validate