const userController = require("../controllers/user.controller");
const {authJwt} = require("../middlewares")

module.exports = (app) => {
    app.get("/crm/api/v1/users",[authJwt.verifyToken, authJwt.isAdmin], userController.findAll);

    app.get("/crm/api/v1/users/:id",[authJwt.verifyToken,authJwt.isValiduserIdReqParam, authJwt.isAdminOrOwner], userController.findByuserId);

    app.put("/crm/api/v1/users/:id", [authJwt.verifyToken,authJwt.isValiduserIdReqParam, authJwt.isAdminOrOwner], userController.update);
}