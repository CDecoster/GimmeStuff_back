var express = require("express");
const { Gifts } = require("../model/gifts");
// const { authorize } = require("../utils/authorize");

var router = express.Router();

const giftModel = new Gifts();





// GET /gifts/amazon/{id} : Get a gift from its id 
router.get("/:id", function (req, res) {
  console.log(`GET /gifts/${req.params.id}`);
<<<<<<< HEAD
  console.log("id simple");
=======
console.log("id simple");
>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
  const gift = giftModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the gift was not found
  if (!gift) return res.status(404).end();

  return res.json(gift);
});

// GET /gifts/ : Get gift 
router.get("/", function (req, res) {


  console.log("GET /gifts");
  return res.json(giftModel.getAll());


});

// GET /gitfs/idAmazon : get gift sur l'id amazon
router.get("/idAmazon=:idAmazon", function(req, res) {
  console.log(`GET /gifts/idAmazon=${req.params.idAmazon}`);
  console.log("1");
  return res.json(giftModel.getOneByIdAmazon(req.params.idAmazon));
});

<<<<<<< HEAD

=======
>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
// POST /gifts : create a gift 
router.post("/", function (req, res) {
  console.log("POST /gifts/add");
 
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    (req.body.hasOwnProperty('image') && req.body.image.length === 0) ||
    (req.body.hasOwnProperty('price') && req.body.price.length === 0) ||
    (req.body.hasOwnProperty('reserved') && req.body.reserved.length === 0) ||
<<<<<<< HEAD
    (req.body.hasOwnProperty('url') && req.body.url.length === 0) ||
=======
    (req.body.hasOwnProperty('url') && req.body.url.length === 0)
>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
    (req.body.hasOwnProperty('idAmazon') && req.body.idAmazon.length === 0)
  )

    return res.status(400).end();

  

  const gift = giftModel.addOne(req.body);

  // return the new gift
  return res.json(gift);
});

// DELETE /gifts/{i} : delete a gift
router.delete("/:id", function (req, res) {
  console.log(`DELETE /gifts/${req.params.id}`);

 

  const gift = giftModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the gift was not found
  if (!gift) return res.status(404).end();

  return res.json(gift);
});

// PUT /gifts/{id} : update a gift at id
router.put("/:id", function (req, res) {
  console.log(`PUT /gifts/${req.params.id}`);

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('title') && req.body.title.length === 0) ||
    (req.body.hasOwnProperty('image') && req.body.image.length === 0) ||
    (req.body.hasOwnProperty('price') && req.body.price.length === 0) ||
    (req.body.hasOwnProperty('reserved') && req.body.reserved.length === 0) ||
<<<<<<< HEAD
    (req.body.hasOwnProperty('url') && req.body.url.length === 0) ||
=======
    (req.body.hasOwnProperty('url') && req.body.url.length === 0)
>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
    (req.body.hasOwnProperty('idAmazon') && req.body.idAmazon.length === 0)
  )
    return res.status(400).end();

  

  const gift = giftModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the gift was not found :
  if (!gift) return res.status(404).end();

  return res.json(gift);
});




module.exports = router;