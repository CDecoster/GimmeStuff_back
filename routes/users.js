var express = require("express");
const { Users } = require("../model/users");


var router = express.Router();

const userModel = new Users();

// GET /users : read all the users from the menu
router.get("/", function (req, res) {
  
  return res.json(userModel.getAll());
});


// GET /users/{id} : Get a user from its id
router.get("/:id", function (req, res) {
  

  const user = userModel.getOne(req.params.id);
  // Send an error code '404 Not Found' if the user was not found
  if (!user) return res.status(404).end();

  return res.json(user);
});



// GET /users by username ou email
router.get("/find/:username", function (req, res) {
 
  

  const username = userModel.getOneByUsername(req.params.username);
  
  if(username) return res.json(username);

  const email = userModel.getOneByEmail(req.params.username);
  
  if(email) return res.json(email);

  return res.status(404).end();
});

// POST /users : create a user 
router.post("/", async function (req, res) {
  

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('email') && req.body.email.length === 0) ||
    (req.body.hasOwnProperty('username') && req.body.username.length === 0) ||
    (req.body.hasOwnProperty('password') && req.body.password.length === 0) ||
    (req.body.hasOwnProperty('birthday') && req.body.birthday.length === 0)
  )

    return res.status(400).end();
  
  const user = await userModel.addOne(req.body);

  // return the new user
  return res.json(user);
});

// DELETE /users/{i} : delete a user 
router.delete("/:id", function (req, res) {
  

  const user = userModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the user was not found
  if (!user) return res.status(404).end();

  return res.json(user);
});

// PUT /users/{id} : update a user at id
router.put("/:id", function (req, res) {
  

  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty('email') && req.body.email.length === 0) ||
    (req.body.hasOwnProperty('username') && req.body.username.length === 0) ||
    (req.body.hasOwnProperty('password')  && req.body.password.length === 0) ||
    (req.body.hasOwnProperty('birthday') && req.body.birthday.length === 0)
  )
    return res.status(400).end();
  
    
   const user = userModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the user was not found :
  
  if (!user) return res.status(404).end();

  return res.json(user);
});




module.exports = router;