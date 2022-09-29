const userController = require("../controllers/user.controller");
const {authJwt} = require("../middlewares")

module.exports = (app) => {
    app.get("/ww/api/v1/users",[authJwt.verifyToken, authJwt.isAdmin], userController.findAll);

    app.get("/ww/api/v1/users/:id",[authJwt.verifyToken,authJwt.isValiduserIdReqParam, authJwt.isAdminOrOwner], userController.findByuserId);

    app.put("/ww/api/v1/users/:id", [authJwt.verifyToken,authJwt.isValiduserIdReqParam, authJwt.isAdminOrOwner], userController.update);
}