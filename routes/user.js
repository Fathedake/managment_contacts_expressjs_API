const express = require("express");
const userController = require('../controllers/user')
const router = express.Router();
const authJwt = require('../middlewares/authjwt')

router.get("/getUser", [authJwt.verifyToken], userController.getUser)
router.put("/user/:id", [authJwt.verifyToken], userController.updateUser)


module.exports = router;