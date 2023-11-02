const express = require("express");
const authController=require('../controllers/auth')
const router= express.Router();
const verifySignUp=require('../middlewares/verifySignUp');
const authJwt = require("../middlewares/authjwt");

router.post(
    "/register",
    [
      verifySignUp.checkedIfUserExist
    ],
    authController.register
  );
router.post("/signin",[],authController.signin)
router.post("/signout",[],authController.signout)

module.exports = router;