var express = require("express");
const { Users } = require("../model/users");
const { verifyTokenAndAdmin } = require("../utils/authorize");

var router = express.Router();

const userModel = new Users();

// GET /users : read all the users from the menu
router.get("/", function (req, res) {
  console.log("GET /users");
  return res.json(userModel.getAll());
});


// GET /users/{id} : Get a user from its id
router.get("/:id", function (req, res) {
  console.log(`GET /users/${req.params.id}`);

  const user = userModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the user was not found
  if (!user) return res.status(404).end();

  return res.json(user);
});

// POST /users : create a user 
router.post("/", async function (req, res) {
  console.log("POST /users");

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('username') && req.body.username.length === 0) ||
    (req.body.hasOwnProperty('password') && req.body.password.length === 0)
  )

    return res.status(400).end();
  console.log("mdp : "+req.body.password);
  console.log("before add one still in route")
  const user = await userModel.addOne(req.body);

  // return the new user
  return res.json(user);
});

// DELETE /users/{i} : delete a user 
router.delete("/:id", function (req, res) {
  console.log(`DELETE /users/${req.params.id}`);

  const user = userModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the user was not found
  if (!user) return res.status(404).end();

  return res.json(user);
});

// PUT /users/{id} : update a user at id
router.put("/:id", function (req, res) {
  console.log(`PUT /users/${req.params.id}`);

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('username') && req.body.username.length === 0) ||
    (req.body.hasOwnProperty('password')  && req.body.password.length === 0)
  )
    return res.status(400).end();
  
   const user = userModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the user was not found :
  if (!user) return res.status(404).end();

  return res.json(user);
});




module.exports = router;