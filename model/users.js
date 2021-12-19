"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { parse, serialize } = require("../utils/json");
//var escape = require("escape-html");
const jwtSecret = "gimmestuff!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const jsonDbPath = __dirname + "/../data/users.json";

const saltRounds = 10;
// Default data
const defaultItems = [
  {
    id: 1,
    username: "admin",
    password: "$2b$10$RqcgWQT/Irt9MQC8UfHmjuGCrQkQNeNcU6UtZURdSB/fyt6bMWARa",
    admin: "true",
    birthday: "2019-06-11T00:00",
    email: "admin@gmail.com",
    sharedWishList: "1,2"

  },

];

class Users {
  constructor(dbPath = jsonDbPath, items = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = items;
  }

  getNextId() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    let nextId;
    if (items.length === 0) nextId = 1;
    else nextId = items[items.length - 1].id + 1;

    return nextId;
  }

  // getId(username){
  //   const items = parse(this.jsonDbPath, this.defaultItems);
  //   for(i=1;i<=items.length;i++){
  //     if(items[i].username ===  )
  //   }
  // }
  /**
   * Returns all items
   * @returns {Array} Array of items
   */
  getAll() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    return items;
  }

  // /*
  // get the wishLists shared with the user
  // */
  // getSharedWishList(id) {
  //   const user = this.getOne(id);
  //   if(!user) return;
  //   return 

  // }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
  getOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;

    return items[foundIndex];
  }

  /**
   * Returns the item identified by username
   * @param {string} username - username of the item to find
   * @returns {object} the item found or undefined if the username does not lead to a item
   */
  getOneByUsername(username) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.username == username);
    if (foundIndex < 0) return;

    return items[foundIndex];
  }


  /**
 * Returns the item identified by username
 * @param {string} email - username of the item to find
 * @returns {object} the item found or undefined if the username does not lead to a item
 */
  getOneByEmail(email) {
    
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.email == email);
    if (foundIndex < 0) return;
    
    return items[foundIndex];
  }

  /**
   * Add a item in the DB and returns the added item (containing a new id)
   * @param {object} body - it contains all required data to create a item
   * @returns {object} the item that was created (with id)
   */

  async addOne(body) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    
    // hash the password
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    
    // add new item to the menu
    
    const newitem = {
      id: this.getNextId(),
      username: body.username,
      password: hashedPassword,
      admin: "false",
      birthday: body.birthday,
      email: body.email,
      sharedWishList: ""
    };
    items.push(newitem);
    serialize(this.jsonDbPath, items);
    return newitem;
  }

  /**
   * Delete a item in the DB and return the deleted item
   * @param {number} id - id of the item to be deleted
   * @returns {object} the item that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = items.splice(foundIndex, 1);
    serialize(this.jsonDbPath, items);

    return itemRemoved[0];
  }

  /**
   * Update a item in the DB and return the updated item
   * @param {number} id - id of the item to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated item or undefined if the update operation failed
   */
   async updateOne(id, body) {
    if(body.password) body.password = await bcrypt.hash(body.password, saltRounds);
    const checkUsername = this.getOneByUsername(body.username);
    if(checkUsername) return;
    const checkEmail = this.getOneByEmail(body.email);
    if(checkEmail) return;
    
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing item - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updateditem = { ...items[foundIndex], ...body };
    // replace the item found at index : (or use splice)
    items[foundIndex] = updateditem;

    serialize(this.jsonDbPath, items);
    return updateditem;
  }

  /**
   * Authenticate a user and generate a token if the user credentials are OK
   * @param {*} username
   * @param {*} password
   * @returns the authenticatedUser ({username:..., token:....}) or undefined if the user could not
   * be authenticated
   */

  async login(username, password) {

    
    const userFound = this.getOneByUsername(username);
    
    if (!userFound) return;
    const match = await bcrypt.compare(password, userFound.password);
   
    if (!match) return;

    
    const authenticatedUser = {
      username: username,
      id: userFound.id,
      token: "Future signed token",
    };
    
    // replace expected token with JWT : create a JWT
    const token = jwt.sign(
      { username: authenticatedUser.username }, // session data in the payload
      jwtSecret, // secret used for the signature
      { expiresIn: LIFETIME_JWT } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }

  /**
   * Create a new user in DB and generate a token
   * @param {*} username
   * @param {*} password
   * @returns the new authenticated user ({username:..., token:....}) or undefined if the user could not
   * be created (if username already in use)
   */

  async register(username, password, email, birthday) {

    const userFound = this.getOneByUsername(username);
   
    if (userFound) return;
    const emailFound = this.getOneByEmail(email);
    
    if (emailFound) return;
    
    /*newUser peut etre delete je pense car par réutilisé plus tard*/
    const newUser = await this.addOne({ username: username, password: password, email: email, birthday: birthday });

    const authenticatedUser = {
      username: username,
      id: newUser.id,
      token: "Future signed token",
    };

    // replace expected token with JWT : create a JWT
    const token = jwt.sign(
      { username: authenticatedUser.username }, // session data in the payload
      jwtSecret, // secret used for the signature
      { expiresIn: LIFETIME_JWT } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  };

 
}

module.exports = { Users };