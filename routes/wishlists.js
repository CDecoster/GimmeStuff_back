var express = require("express");
const { Wishlists } = require("../model/wishlists");
const { authorize } = require("../utils/authorize");

var router = express.Router();

const wishlistModel = new Wishlists();


// GET /wishlists : read all the wishlists from a user
router.get("/user=:id", function (req, res) {
  console.log(`in route GET /wishlists/user=${req.params.id}`);

  return res.json(wishlistModel.getOwn(req.params.id));
});


// GET /wishlists/{id} : Get a wishlist from its
router.get("/:id", function (req, res) {
  console.log(`GET /wishlists/${req.params.id}`);

  const wishlist = wishlistModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the wishlist was not found
  if (!wishlist) return res.status(404).end();

  return res.json(wishlist);
});

// GET /wishlists/ : Get all wishlists
router.get("/", function (req, res) {


  console.log("GET /wishlists");
  return res.json(wishlistModel.getAll());


});

// POST /wishlists : create a wishlist 
router.post("/", authorize, function (req, res) {
  console.log("POST /wishlists/add");

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    (req.body.hasOwnProperty('utilisateur') && req.body.utilisateur.length === 0) ||
    (req.body.hasOwnProperty('description') && req.body.description.length === 0) ||
    (req.body.hasOwnProperty('content') && req.body.content.length === 0)
  )

    return res.status(400).end();

  if (req.user.admin !== "true") return res.status(403).end();

  const wishlist = wishlistModel.addOne(req.body);

  // return the new wishlist
  return res.json(wishlist);
});

// DELETE /wishlists/{i} : delete a wishlist 
router.delete("/:id", authorize, function (req, res) {
  console.log(`DELETE /wishlists/${req.params.id}`);

  if (req.user.admin !== "true") return res.status(403).end();

  const wishlist = wishlistModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the wishlist was not found
  if (!wishlist) return res.status(404).end();

  return res.json(wishlist);
});

// PUT /wishlists/{id} : update a wishlist at id
router.put("/:id", authorize, function (req, res) {
  console.log(`PUT /wishlists/${req.params.id}`);

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    (req.body.hasOwnProperty('utilisateur') && req.body.utilisateurt.length) === 0 ||
    (req.body.hasOwnProperty('description') && req.body.description.length === 0) ||
    (req.body.hasOwnProperty('content') && req.body.content.length === 0)
  )
    return res.status(400).end();

  if (req.user.admin !== "true") return res.status(403).end();

  const wishlist = wishlistModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the wishlist was not found :
  if (!wishlist) return res.status(404).end();

  return res.json(wishlist);
});




module.exports = router;