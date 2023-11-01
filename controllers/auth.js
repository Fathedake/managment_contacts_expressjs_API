const { db, client } = require("../db/connection");
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require('../config/auth')
const {ObjectId} = require('mongodb');


exports.register = async (req, res) => {

  const password = bcrypt.hashSync(req.body.password, 8)
  try {
    let newUser = new User(req.body.nom,
      req.body.prenoms,
      req.body.email,
      password,
      req.body.avatar)
    let result = await db().collection("users").insertOne(newUser)
    return res.status(200).json(result)
  } catch (error) {
    //console.log(error)
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }

}

exports.signin = async (req, res) => {
  let email = req.body.email
  try {
    let user = await db().collection('users').findOne({ "email": email })
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

    const token = jwt.sign({ _id: user._id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 2592000 // 1 mois en secondes
      });
   // console.log(token)
    req.session.token = token;
   // console.log("re cookie",req.session).maxAge=120000

    return res.status(200).send(
      {
        user: {
          _id: user._id,
          nom: user.nom,
          prenoms: user.prenoms,
          avatar: user.avatar,
          email: user.email,
        },
        //accessToken: token
      }
    );
  } catch (error) {
    return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }
};


exports.signout = async (req, res) => {
 // console.log(req)
  try {
    req.session = null;
    return res.status(200).send({
      msg: "Déconnexion avec succès!"
    });
  } catch (err) {
   return res.status(500).send({ msg: "Quelque chose n'a pas marché sur le serveur" });
  }
};

