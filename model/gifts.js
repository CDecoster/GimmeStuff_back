"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const escapeHTML = require("escape-html");

const jsonDbPath = __dirname + "/../data/gifts.json";



/* au final c'est peut etre mieux de rename ce model et de tout remplacer en wishlist, il faudrait alors créer un model gift */
// Default wishlist
const defaultGifts = [
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

class Gifts {
  constructor(dbPath = jsonDbPath, defaultItems = defaultGifts) {
    this.jsonDbPath = dbPath;
    this.defaultGifts = defaultItems;
  }

  getNextId() {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);
    let nextId;
    if (gifts.length === 0) nextId = 1;
    else nextId = gifts[gifts.length - 1].id + 1;
    console.log("getNextId");
    return nextId;
  }

  /**
   * Returns all gifts
   * @returns {Array} Array of gifts
   */
  getAll() {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);
    return gifts;
  }

  /**
   * Returns the gift identified by id
   * @param {number} id - id of the gift to find
   * @returns {object} the gift found or undefined if the id does not lead to a gift
   */
  getOne(id) {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);
    const foundIndex = gifts.findIndex((gift) => gift.id == id);
    if (foundIndex < 0) return;

    return gifts[foundIndex];
  }

  /**
   * Add a gift in the DB and returns the added gift (containing a new id)
   * @param {object} body - it contains all required data to create a gift
   * @returns {object} the gift that was created (with id)
   */

  addOne(body) {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);

    // add new gift to the menu
    const newGift = {
      id: this.getNextId(),
      title: escape(body.title),
      utilisateur: escape(body.utilisateur),
      content: escape(body.content),
    };
  
    gifts.push(newGift);
  
    serialize(this.jsonDbPath, gifts);
    return newGift;
  }

  /**
   * Delete a gift in the DB and return the deleted gift
   * @param {number} id - id of the gift to be deleted
   * @returns {object} the gift that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);
    const foundIndex = gifts.findIndex((gift) => gift.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = gifts.splice(foundIndex, 1);
    serialize(this.jsonDbPath, gifts);

    return itemRemoved[0];
  }

  /**
   * Update a gift in the DB and return the updated gift
   * @param {number} id - id of the gift to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated gift or undefined if the update operation failed
   */
  updateOne(id, body) {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);
    const foundIndex = gifts.findIndex((gift) => gift.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing gift - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updatedGift = { ...gifts[foundIndex] };
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        const element = body[key];
        updatedGift[key] = escape(element);
      }
    }
    // replace the gift found at index : (or use splice)
    gifts[foundIndex] = updatedGift;

    serialize(this.jsonDbPath, gifts);
    return updatedGift;
  }
}

module.exports = { Gifts };