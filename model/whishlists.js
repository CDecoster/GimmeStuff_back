"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const escapeHTML = require("escape-html");

const jsonDbPath = __dirname + "/../data/whishlists.json";



/* au final c'est peut etre mieux de rename ce model et de tout remplacer en wishlist, il faudrait alors créer un model gift */
// Default wishlist
const defaultWhishlists = [
  {
    id: 1,
    title: "4 fromages",
    utilisateur: "nicolas",
    content: "Gruyère, Sérac, Appenzel, Gorgonzola, Tomates",
  },
  {
    id: 2,
    title: "Vegan",
    utilisateur: "corention",
    content: "Tomates, Courgettes, Oignons, Aubergines, Poivrons",
  },
  {
    id: 3,
    title: "Vegetarian",
    utilisateur: "axel",
    content: "Mozarella, Tomates, Oignons, Poivrons, Champignons, Olives",
  },
  {
    id: 4,
    title: "Alpage",
    utilisateur: "alexis",
    content: "Gruyère, Mozarella, Lardons, Tomates",
  },
  {
    id: 5,
    title: "Diable",
    utilisateur: "maximilien",
    content: "Tomates, Mozarella, Chorizo piquant, Jalapenos",
  },
];

class Whishlists {
  constructor(dbPath = jsonDbPath, defaultItems = defaultWhishlists) {
    this.jsonDbPath = dbPath;
    this.defaultWhishlists = defaultItems;
  }

  getNextId() {
    const whishlists = parse(this.jsonDbPath, this.defaultWhishlists);
    let nextId;
    if (whishlists.length === 0) nextId = 1;
    else nextId = whishlists[whishlists.length - 1].id + 1;
    console.log("getNextId");
    return nextId;
  }

  /**
   * Returns all whishlists
   * @returns {Array} Array of whishlists
   */
  getAll() {
    const whishlists = parse(this.jsonDbPath, this.defaultWhishlists);
    return whishlists;
  }

  /**
   * Returns the whishlist identified by id
   * @param {number} id - id of the whishlist to find
   * @returns {object} the whishlist found or undefined if the id does not lead to a whishlist
   */
  getOne(id) {
    const whishlists = parse(this.jsonDbPath, this.defaultWhishlists);
    const foundIndex = whishlists.findIndex((whishlist) => whishlist.id == id);
    if (foundIndex < 0) return;

    return whishlists[foundIndex];
  }

  /**
   * Add a whishlist in the DB and returns the added whishlist (containing a new id)
   * @param {object} body - it contains all required data to create a whishlist
   * @returns {object} the whishlist that was created (with id)
   */

  addOne(body) {
    const whishlists = parse(this.jsonDbPath, this.defaultWhishlists);

    // add new whishlist to the menu
    const newWhishlist = {
      id: this.getNextId(),
      title: escape(body.title),
      utilisateur: escape(body.utilisateur),
      content: escape(body.content),
    };
  
    whishlists.push(newWhishlist);
  
    serialize(this.jsonDbPath, whishlists);
    return newWhishlist;
  }

  /**
   * Delete a whishlist in the DB and return the deleted whishlist
   * @param {number} id - id of the whishlist to be deleted
   * @returns {object} the whishlist that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const whishlists = parse(this.jsonDbPath, this.defaultWhishlists);
    const foundIndex = whishlists.findIndex((whishlist) => whishlist.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = whishlists.splice(foundIndex, 1);
    serialize(this.jsonDbPath, whishlists);

    return itemRemoved[0];
  }

  /**
   * Update a whishlist in the DB and return the updated whishlist
   * @param {number} id - id of the whishlist to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated whishlist or undefined if the update operation failed
   */
  updateOne(id, body) {
    const whishlists = parse(this.jsonDbPath, this.defaultWhishlists);
    const foundIndex = whishlists.findIndex((whishlist) => whishlist.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing whishlist - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updatedWhishlist = { ...whishlists[foundIndex] };
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        const element = body[key];
        updatedWhishlist[key] = escape(element);
      }
    }
    // replace the whishlist found at index : (or use splice)
    whishlists[foundIndex] = updatedWhishlist;

    serialize(this.jsonDbPath, whishlists);
    return updatedWhishlist;
  }
}

module.exports = { Whishlists };