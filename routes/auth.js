const express = require("express");
const authController=require('../controllers/auth')
const router= express.Router();
const verifySignUp=require('../middlewares/verifySignUp');
const authJwt = require("../middlewares/authjwt");

router.post(
  "/createUser",
  [
    verifySignUp.checkedIfUserExist
  ],
  authController.createUser
);
router.get("/getUser/:id", authController.getUser)

router.get("/getUserByEmail/:email", authController.getUserByEmail)

router.get("/getUserByAccount/:providerAccountId/:provider", authController.getUserByAccount)

router.put("/updateUser/:id",authController.updateUser)


router.post(
  "/createSession",
  authController.createSession
);
router.get(
  "/getSessionAndUser/:sessionToken",
  authController.getSessionAndUser
);

router.get(
  "/deleteSession/:sessionToken",
  authController.deleteSession
);


router.post("/linkAccount",authController.linkAccount)
















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