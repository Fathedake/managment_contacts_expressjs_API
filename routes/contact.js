const express = require("express");
const contactController=require('../controllers/contacts')
const router= express.Router();
const authJwt=require('../middlewares/authjwt')

 router.post("/contacts",[authJwt.verifyToken],contactController.addContact)
  router.get("/contacts/user",[authJwt.verifyToken],contactController.getContacts)
  router.get("/contacts/:id",[authJwt.verifyToken],contactController.getContact)
  router.put("/contacts/:id",[authJwt.verifyToken],contactController.updateContact)
  router.delete("/contacts/:id",[authJwt.verifyToken],contactController.deleteContact)
  
 /* router.route("/contatcts").post(contactController.addContact)
  router.route("/contatcts").get(contactController.getContacts)
  router.route("/contatcts/:id").get(contactController.getContact)
  router.route("/contatcts/:id").put(contactController.updateContact)
  router.route("/contatcts/:id").delete(contactController.deleteContact)
*/
  module.exports = router;