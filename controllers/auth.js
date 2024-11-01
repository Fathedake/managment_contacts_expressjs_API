const UserModel = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require('../config/auth')
const mongoose = require("mongoose");
const AccountModel = require("../models/Account");
const SessionModel = require("../models/Session");
const { v4: uuidv4 } = require('uuid');

const generateSessionToken = () => {
  return uuidv4();
}

exports.createUser = async (req, res) => {
  const password = req.body.password ? bcrypt.hashSync(req.body.password, 8) :""
  try {
    let varuser = {
      fistname: req.body.firstname ? req.body.firstname : req.body.name,
      lastname: req.body.lastname ? req.body.lastname : "",
      email: req.body.email,
      avatar: req.body.avatar,
    }
    if (password.length!=0) {
      varuser.password = password
    }
    let newUser = new UserModel(varuser)
    let result = await newUser.save()
    return res.status(200).json({ message: "crée avec succès", user:newUser })
  } catch (error) {
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }
}

exports.getUser = async (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id)
  try {
    let user = await UserModel.findOne({ "_id": id })
    if (!user) {

      return res.status(404).send({ message: "Utilisateur introuvable", });
    }

    return res.status(200).send(
      {
        user
      }
    );
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}
exports.getUserByEmail = async (req, res) => {
  {
    let email = req.params.email
    try {
      let user = await UserModel.findOne({ "email": email })
      if (user) {
        return res.status(200).send(
          {
            user
          }
        );

      } else {
        return res.status(404).send(
          {
            message:"user non trouvé",
          user: null,
          }
        );
      }

    } catch (error) {
      return res.status(500).send({ message: "Quelque chose n'a pas marché " })
    }

  }
},



  exports.getUserByAccount = async (req, res) => {
    {
      const providerAccountId = req.params.providerAccountId

      const provider = req.params.provider
      try {
        let account = await AccountModel.findOne({ "providerAccountId": providerAccountId, "provider": provider })
        if (account) {
          const userId = mongoose.Types.ObjectId(account.userId)
          let user = await UserModel.findOne({ "_id": userId })
          return res.status(200).send(
            {
              user
            }
          );

        } else {
          return res.status(404).send(
            {
              user: null,
            }
          );
        }

      } catch (error) {
        return res.status(500).send({ message: "Quelque chose n'a pas marché " })
      }

    }
  },


  exports.updateUser = async (req, res) => {
    try {
      let id = new mongoose.Types.ObjectId(req.params.id)
      let user = await UserModel.findOne({ _id: id })
      if (!user) {
        return res.status(404).json({ msg: "Utilisateur non trouvé" })
      }
      let result = await UserModel.updateOne({ _id: id }, { $set: { ...req.body, } })

      return res.status(200).json({ msg: "Modification réussie", user: result })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

exports.linkAccount = async (req, res) => {
  const account = req.body
  try {
    const user = await UserModel.findOne({ "_id": account.userId })

    account.userId = new mongoose.Types.ObjectId(user.id)
    const linkAccount = new AccountModel(account)
    let result = await linkAccount.save()
    return res.status(200).json({ account :result})
  } catch (error) {
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }

}
exports.createSession = async (req, res) => {
  const sessionToken = generateSessionToken();
  const userId = req.body.userId
  const expires =new Date(Date.now() + 3600000)
  try {
    let varsession = {
      session_token: sessionToken,
      expires: expires,
      userId: new mongoose.Types.ObjectId(userId),
    }

    let newSession = new SessionModel(varsession)
    let result = await newSession.save()
    return res.status(200).json({ message: "session creer avec succès", session: result })
  } catch (error) {
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }
}


exports.getSessionAndUser = async (req, res) => {
  {
    let sessionToken = req.params.sessionToken
    try {
      let session = await SessionModel.findOne({ "sessionToken": sessionToken })
      if (session) {
        let user = await UserModel.findOne({ "_id": session.userId })
        return res.status(200).send(
          {
            user,
            session
          }
        );

      } else {
        return res.status(404).send(
          {
            user: null,
            session: null,
          }
        );
      }

    } catch (error) {
      return res.status(500).send({ message: "Quelque chose n'a pas marché " })
    }

  }
},

  exports.deleteSession = async (req, res) => {
    try {
      let sessionToken = new ObjectId(req.params.sessionToken)
      let result = SessionModel.deleteOne({ "sessionToken": sessionToken })
      if (result.deletedCount == 1) {
        return res.status(200).json({ msg: "Suppression réussie", success: true })
      } else {
        return res.status(404).json({ msg: "Session non trouvé pour supprimer", success: false })
      }


    } catch (error) {
      return res.status(500).json(error)
    }
  }
exports.register = async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 8)
  const session = await mongoose.startSession();
  try {
    let newUser = new UserModel({
      fistname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password,
      avatar: req.body.avatar,
    })

    await session.startTransaction();
    let result = await newUser.save()
    const accessToken = jwt.sign({ _id: newUser.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 2592000 // 1 months in seconds
      });
    const newAccount = new AccountModel({
      provider: 'credentials', // Replace with your provider
      providerAccountId: newUser.id,
      access_token: accessToken,
      token_type: 'Bearer',
      userId: newUser.id
    })
    const savedAccount = await newAccount.save();
    await session.commitTransaction();
    return res.status(200).json(result)
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  } finally {
    await session.endSession();
  }
}
exports.signin = async (req, res) => {
  let email = req.body.email
  try {
    let user = await UserModel.findOne({ "email": email })
    if (!user) {
      return res.status(404).send({ msg: "Utilisateur non trouvé", });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );


    if (!passwordIsValid) {
      return res.status(401).send({
        msg: "Vos identifiants sont incorrectes!",
      });
    }
    return res.status(200).send(
      {
        user
      }
    );
  } catch (error) {
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }
};


exports.signout = async (req, res) => {
  try {
    
    return res.status(200).send({
      msg: "Déconnexion avec succès!"
    });
  } catch (err) {
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }
};

