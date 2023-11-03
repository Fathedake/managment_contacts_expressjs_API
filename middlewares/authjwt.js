const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const { db } = require("../db/connection");

verifyToken = (req, res, next) => {
 
  if (!req.query.token)
    return res.status(401).json({ success: false, message: "Pas de jeton fournit" })

  let token = req.query.token

  // Bearer token
 // token = token.split(" ")[1]
  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: "Non autorisé!",
          user: null,
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
