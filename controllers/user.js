const { db, client } = require("../db/connection");
const User = require("../models/User")

const { ObjectId } = require('mongodb');


exports.getUser = async (req, res) => {
  let id = new ObjectId(req.userId)
  //console.log("req_id", id)
  try {
    let user = await db().collection('users').findOne({ "_id": id })
    if (!user) {
      return res.status(200).send({ message: "Utilisateur non connecté", user: {_id:'',nom:'',prenoms:'',email:''}});
    }
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
    return res.status(500).send({ message: error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let id = new ObjectId(req.params.id)
    let user = await db().collection("users").findOne({ _id: id })
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" })
    }
    //console.log(user._id ,id)
    if (req.params.id== req._id) {
      let result = await db().collection("users").updateOne({_id: id }, { $set: {...req.body,} })
      //if (result.modifiedCount === 0) {
        //return res.status(304).json({ msg: "Echec de la mis à jour.Il semble que tu n'as changé aucune donnée" })
      //} else {
        return res.status(200).json({ msg: "Modification réussie" })

     // }
    } else {
      return res.status(403).json({ msg: "Attention!Tu n'es pas autorisé à modifier les données d'autrui!" })
    }


  } catch (error) {
    //console.log(error)
    return res.status(500).json(error)
  }
}

