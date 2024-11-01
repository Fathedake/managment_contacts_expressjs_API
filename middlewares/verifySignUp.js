const { ObjectID } = require("bson");
const UserModel = require("../models/User")

//verifier si l'email du user est déjà utilisé
checkedIfUserExist = async (req, res, next) => {
  let email = req.body.email
  try {
    let user = await UserModel.findOne({ "email": email })
    if (user) {
      return res.status(400).send({
        message: "Ce email est déjà utilisé",
        user,
      });

    }
    next()
  } catch (error) {
    return res.status(500).send({ message: "Quelque chose n'a pas marché " })
  }

}

const verifySignUp = {
  checkedIfUserExist,
};

module.exports = verifySignUp;
