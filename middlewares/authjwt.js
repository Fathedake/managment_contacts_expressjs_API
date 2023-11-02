const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const {db} = require("../db/connection");

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "Pas de jeton fournit!",
    });
  }

  jwt.verify(token,
             config.secret,
             (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Non autorisé!",
                  user:null,
                });
              }
             
              req.userId = decoded.id;
              next();
             });
};
const authJwt = {
  verifyToken,
};
module.exports = authJwt;
