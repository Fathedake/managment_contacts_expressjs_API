const { ObjectID } = require("bson");
const {db,client} = require("../db/connection");

//verifier si l'email du user est déjà utilisé
checkedIfUserExist=async (req,res,next)=>{
    let email = req.body.email;
    try {
      let user = await db().collection('users').findOne({ "email": email });
      return res.status(409).send({
        message: "Cet e-mail est déjà utilisé",
        user:user
      });
     if (user) {
        return res.status(409).send({
          message: "Cet e-mail est déjà utilisé"
        });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
      // Vous pouvez également utiliser next(error) pour passer l'erreur à la gestion des erreurs globale.
    }
 }
/*
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  } 
  next();
};*/

const verifySignUp = {
    checkedIfUserExist,
  //checkRolesExisted
};

module.exports = verifySignUp;
