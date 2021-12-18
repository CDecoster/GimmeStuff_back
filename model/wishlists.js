"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const escapeHTML = require("escape-html");

const jsonDbPath = __dirname + "/../data/wishlists.json";



// Default wishlist
const defaultWishlists = [
  {
    id: 1,
    title: "4 fromages",
    utilisateur: "nicolas",
    description: "description",
    content: "Gruyère, Sérac, Appenzel, Gorgonzola, Tomates",
  },
  {
    id: 2,
    title: "Vegan",
    utilisateur: "corention",
    description: "description",
    content: "Tomates, Courgettes, Oignons, Aubergines, Poivrons",
  },
  {
    id: 3,
    title: "Vegetarian",
    utilisateur: "axel",
    description: "description",
    content: "Mozarella, Tomates, Oignons, Poivrons, Champignons, Olives",
  },
  {
    id: 4,
    title: "Alpage",
    utilisateur: "alexis",
    description: "description",
    content: "Gruyère, Mozarella, Lardons, Tomates",
  },
  {
    id: 5,
    title: "Diable",
    utilisateur: "maximilien",
    description: "description",
    content: "Tomates, Mozarella, Chorizo piquant, Jalapenos",
  },
];

class Wishlists {
  constructor(dbPath = jsonDbPath, defaultItems = defaultWishlists) {
    this.jsonDbPath = dbPath;
    this.defaultWishlists = defaultItems;
  }

  getNextId() {
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);
    let nextId;
    if (wishlists.length === 0) nextId = 1;
    else nextId = wishlists[wishlists.length - 1].id + 1;
    console.log("getNextId");
    return nextId;
  }

  /**
   * Returns all wishlists
   * @returns {Array} Array of wishlists
   */
  

  getAll() {
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);
    return wishlists;
  }
/**
   * Returns all wishlists created by a user
   * @param {number} id - id of the user to find
   * @returns {Array} Array of wishlists
   */
  getOwn(id){
    
    
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);
    const arrayWishlists = [];
    for(var i in wishlists){
      
      if(wishlists[i].utilisateur === id){
        arrayWishlists.push(wishlists[i]);
        
      }
    }
    return arrayWishlists;
  }

  /**
   * Returns the wishlist identified by id
   * @param {number} id - id of the wishlist to find
   * @returns {object} the wishlist found or undefined if the id does not lead to a wishlist
   */
  getOne(id) {
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);
    const foundIndex = wishlists.findIndex((wishlist) => wishlist.id == id);
    if (foundIndex < 0) return;

    return wishlists[foundIndex];
  }

  /**
   * Add a wishlist in the DB and returns the added wishlist (containing a new id)
   * @param {object} body - it contains all required data to create a wishlist
   * @returns {object} the wishlist that was created (with id)
   */

  addOne(body) {
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);

    // add new wishlist to the menu
    const newWishlist = {
      id: this.getNextId(),
      title: escape(body.title),
      utilisateur: escape(body.utilisateur),
      description: escape(body.description),
      content: escape(body.content),
    };
  
    wishlists.push(newWishlist);
  
    serialize(this.jsonDbPath, wishlists);
    return newWishlist;
  }

  /**
   * Delete a wishlist in the DB and return the deleted wishlist
   * @param {number} id - id of the wishlist to be deleted
   * @returns {object} the wishlist that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);
    const foundIndex = wishlists.findIndex((wishlist) => wishlist.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = wishlists.splice(foundIndex, 1);
    serialize(this.jsonDbPath, wishlists);

    return itemRemoved[0];
  }

  /**
   * Update a wishlist in the DB and return the updated wishlist
   * @param {number} id - id of the wishlist to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated wishlist or undefined if the update operation failed
   */
  updateOne(id, body) {
    const wishlists = parse(this.jsonDbPath, this.defaultWishlists);
    const foundIndex = wishlists.findIndex((wishlist) => wishlist.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing wishlist - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updatedWishlist = { ...wishlists[foundIndex] };
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        const element = body[key];
        updatedWishlist[key] = escape(element);
      }
    }
    // replace the wishlist found at index : (or use splice)
    wishlists[foundIndex] = updatedWishlist;

    serialize(this.jsonDbPath, wishlists);
    return updatedWishlist;
  }
}

module.exports = { Wishlists };