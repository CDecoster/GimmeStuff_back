var express = require("express");
const { Whishlists } = require("../model/whishlists");
const { authorize } = require("../utils/authorize");

var router = express.Router();

const whishlistModel = new Whishlists();

/* si on a rename et change le model de whishlist en whishlist il faut faire la même chose ici et créer une route pour des cadeaux dans une whishlist ex : /whishlist=1/:id  pour déterminer une id de cadeau, c'est juste une idée , à discuter*/ 

// GET /whishlists : read all the whishlists from the wishlist
router.get("/", function (req, res) {
  console.log("GET /whishlists");
  return res.json(whishlistModel.getAll());
});


// GET /whishlists/{id} : Get a whishlist from its id in the wishlist
router.get("/:id", function (req, res) {
  console.log(`GET /whishlists/${req.params.id}`);

  const whishlist = whishlistModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the whishlist was not found
  if (!whishlist) return res.status(404).end();

  return res.json(whishlist);
});

// POST /whishlists : create a whishlist to be added to the wishlist.
router.post("/", authorize, function (req, res) {
  console.log("POST /whishlists/add");

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    req.body.hasOwnProperty('utilisateur')  && req.body.utilisateur.length === 0 ||
    (req.body.hasOwnProperty('content')  && req.body.content.length === 0)
  )

    return res.status(400).end();

  if (req.user.admin !== "true") return res.status(403).end();

  const whishlist = whishlistModel.addOne(req.body);

  // return the new whishlist
  return res.json(whishlist);
});

// DELETE /whishlists/{i} : delete a whishlist from the wishlist
router.delete("/:id", authorize, function (req, res) {
  console.log(`DELETE /whishlists/${req.params.id}`);

  if (req.user.admin !== "true") return res.status(403).end();

  const whishlist = whishlistModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the whishlist was not found
  if (!whishlist) return res.status(404).end();

  return res.json(whishlist);
});

// PUT /whishlists/{id} : update a whishlist at id
router.put("/:id",authorize, function (req, res) {
  console.log(`PUT /whishlists/${req.params.id}`);

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    req.body.hasOwnProperty('utilisateur')  && req.body.utilisateurt.length === 0 ||
    (req.body.hasOwnProperty('content')  && req.body.content.length === 0)
  )
    return res.status(400).end();
  
  if (req.user.admin !== "true") return res.status(403).end();
 
  const whishlist = whishlistModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the whishlist was not found :
  if (!whishlist) return res.status(404).end();

  return res.json(whishlist);
});




module.exports = router;