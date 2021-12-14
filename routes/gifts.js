var express = require("express");
const { Gifts } = require("../model/gifts");
const { authorize } = require("../utils/authorize");

var router = express.Router();

const giftModel = new Gifts();

/* si on a rename et change le model de gift en whishlist il faut faire la même chose ici et créer une route pour des cadeaux dans une whishlist ex : /whishlist=1/:id  pour déterminer une id de cadeau, c'est juste une idée , à discuter*/ 

// GET /gifts : read all the gifts from the wishlist
router.get("/", function (req, res) {
  console.log("GET /gifts");
  return res.json(giftModel.getAll());
});


// GET /gifts/{id} : Get a gift from its id in the wishlist
router.get("/:id", function (req, res) {
  console.log(`GET /gifts/${req.params.id}`);

  const gift = giftModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the gift was not found
  if (!gift) return res.status(404).end();

  return res.json(gift);
});

// POST /gifts : create a gift to be added to the wishlist.
router.post("/", authorize, function (req, res) {
  console.log("POST /gifts");

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    req.body.hasOwnProperty('utilisateur')  && req.body.utilisateur.length === 0 ||
    (req.body.hasOwnProperty('content')  && req.body.content.length === 0)
  )

    return res.status(400).end();

  if (req.user.admin !== "true") return res.status(403).end();

  const gift = giftModel.addOne(req.body);

  // return the new gift
  return res.json(gift);
});

// DELETE /gifts/{i} : delete a gift from the wishlist
router.delete("/:id", authorize, function (req, res) {
  console.log(`DELETE /gifts/${req.params.id}`);

  if (req.user.admin !== "true") return res.status(403).end();

  const gift = giftModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the gift was not found
  if (!gift) return res.status(404).end();

  return res.json(gift);
});

// PUT /gifts/{id} : update a gift at id
router.put("/:id",authorize, function (req, res) {
  console.log(`PUT /gifts/${req.params.id}`);

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    req.body.hasOwnProperty('utilisateur')  && req.body.utilisateurt.length === 0 ||
    (req.body.hasOwnProperty('content')  && req.body.content.length === 0)
  )
    return res.status(400).end();
  
  if (req.user.admin !== "true") return res.status(403).end();
 
  const gift = giftModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the gift was not found :
  if (!gift) return res.status(404).end();

  return res.json(gift);
});




module.exports = router;