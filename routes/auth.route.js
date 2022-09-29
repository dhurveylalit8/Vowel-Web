/**
* This file will contain the logic for routing request
* 
* This file is dedicated to the routing logic for sign up and sign in
*/
const authController = require("../controllers/auth.controller")
const {verifySignup} = require("../middlewares")
module.exports = (app) => {
    /**
     * POST /crm/api/v1/auth/signup
     */

    app.post("/crm/api/v1/auth/signup",[verifySignup.validateSignInRequestBody], authController.signup);

    /**
     * Login
     * 
     * POST /crm/api/v1/auth/login
     */
    app.post("/crm/api/v1/auth/signin",[verifySignup.validateSignInRequestBody], authController.signin);
}