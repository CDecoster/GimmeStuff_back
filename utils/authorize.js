const jwt = require("jsonwebtoken");
const jwtSecret = "gimmestuff!";

const { Users } = require("../model/users");
const userModel = new Users();

/**
 * Authorize middleware to be used on the routes to be secured/
 * This middleware authorize only user that have a valid JWT
 * and which are still present in the list of potential authenticated users
 */
 const authorize = (req, res, next) => {
    let token = req.get("authorization");
    if (!token) return res.status(401).end();
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      // check if decoded.username exists in users
      const userFound = userModel.getOneByUsername(decoded.username);
  
      if (!userFound) return res.status(403).end();
      // if (!userFound.admin) return res.status(403).end();
      // we could load the user in the request.user object so that it is available by all
      // other middleware
      req.user = userFound;
      next(); // call the next Middleware
    } catch (err) {
      console.error("authorize: ", err);
      return res.status(403).end();
    }
  };

  /*A créer un check pour si admin ou pas */

  /*Authorize a changer par un check si c'est bien le proprio de la wishlist qui essaye de faire un changement ajouter, modifier, delete*/
  
  
  module.exports = { authorize }; 