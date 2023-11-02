const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const { db } = require("../db/connection");

verifyToken = (req, res, next) => {
  // let token = req.session.token;

  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "Pas de jeton fournit!",
    });
  }

  let token = req.headers.authorization

  // Bearer token
  token = token.split(" ")[1]


  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Non autorisé!",
          user: null,
        });
      }

      req.userId = decoded.id;
      next();
    });
};

/*isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Moderator Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Moderator role!",
    });
  }
};

isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Moderator or Admin role!",
    });
  }
};
*/
const authJwt = {
  verifyToken,
};
module.exports = authJwt;
