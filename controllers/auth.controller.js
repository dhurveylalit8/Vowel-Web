/**
 * This file will contain the logic for the 
* registration of the user and login of the user 
* 
* 
* User : 
* 
* Customer
*      1. Registers and is approved by default
*      2. Should be able to login immediately
* 
* Admin
*      1. ADMIN user should be only created from the backend...No API 
*      should be supported for it
*/
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config")
const constants = require("../utils/constants")
/**
 * Logic to accept the registration/signup
 * 
 * req --> What we get from the client
 * res --> What we return from the server
 */

exports.signup = async (req, res) => {
    /**
     * I need to read the data from the request body
     */
    if(req.body.userType != constants.userTypes.customer){
        req.body.userStatus = constants.userStatus.pending;
    }

    /**
     * Convert that into the JS object for inserting in the mongo db
     */
    const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password, 8),
        userStatus : req.body.userStatus
    };

    /**
     * Insert the data and return the response
     */
    try{
        const userCreated = await User.create(userObj);
        /**
         * we need to return the newly created user as the response.
         * But we should remove some sensitive feilds
         *  - Password
         *  - _V
         * We need to create the custome response and return
         */
        const response = {
            name : userCreated.name,
            userId : userCreated.userId,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus
           //  createdAt : userCreated.createdAt,
           //  updatedAt : userCreated.updatedAt
        }
        console.log(response)
        res.status(201).send(response);
    }catch(err){
        console.log("Some error happened ", err.message);
        res.status(500).send({
            message : "Some internal server error"
        });
    }
}

/**
 * Logic for sign in
 */

exports.signin = async (req, res) => {
    /**
     * If the userId passed is correct
     */
    try{

        const user = await User.findOne({userId : req.body.userId});
        if(user == null){
            return res.status(400).send({
                message : "Failed ! userId passed doesn't exist"
            });
        }

        /**
         * Check if the user is in PENDING state
        */
        if(user.userStatus == constants.userStatus.pending){
            return res.status(400).send({
                message : "Not yet approved from the admin"
            })
        }

        /**
         * If the password passed is correct
         */
        const passwordIsvalid = bcrypt.compareSync(req.body.password, user.password)

        if(!passwordIsvalid){
            return res.status(401).send({
                message : "Wrong password"
            });
        }

        /**
         * Create the JWT token
         */
        const token = jwt.sign({
            id : user.userId
        }, authConfig.secret, {
            expiresIn : 600
        });

        /**
         * Send the successful login response
         */
        res.status(200).send({
            name : user.name,
            userId : user.userId,
            email : user.email,
            userType : user.userType,
            userStatus : user.userStatus,
            accessToken :  token
        });
    }catch(err){
        console.log("Internal error, " , err.message);
        res.status(500).send({
            message : "Some internal error while signin"
        })
    }   
}