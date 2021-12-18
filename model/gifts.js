"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");
const escapeHTML = require("escape-html");

const jsonDbPath = __dirname + "/../data/gifts.json";



// Default gift
const defaultGifts = [
  {
    id: 1,
    title: "giftTitle1",
    image: "giftImage1",
    price: "giftPrice1",
    reserved: "false",
<<<<<<< HEAD
    url: "testurl1",
    idAmazon: "B00BSHB4XG"
=======
    url:"testurl1",
    idAmazon:"B00BSHB4XG"
>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
  },
  {
    id: 2,
    title: "giftTitle2",
    image: "giftImage2",
    price: "giftPrice2",
    reserved: "true",
<<<<<<< HEAD
    url: "testurl2",
    idAmazon: "B01B2MAQ2G"
=======
    url:"testurl2",
    idAmazon:"B01B2MAQ2G"
>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
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
<<<<<<< HEAD
  /**
     * Returns the gift identified by id
     * @param {number} idAmazon - idAmazon of the gift to find
     * @returns {object} the gift found or undefined if the id does not lead to a gift
     */
  getOneByIdAmazon(idAmazon) {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);
    const foundIndex = gifts.findIndex((gift) => gift.idAmazon == idAmazon);
    if (foundIndex < 0) return;
    console.log(foundIndex + " FOUND INDEX");
    return gifts[foundIndex];
  }
=======

   /**
   * Returns the gift identified by id
   * @param {number} idAmazon - idAmazon of the gift to find
   * @returns {object} the gift found or undefined if the id does not lead to a gift
   */
    getOneByIdAmazon(idAmazon) {
      const gifts = parse(this.jsonDbPath, this.defaultGifts);
      const foundIndex = gifts.findIndex((gift) => gift.idAmazon == idAmazon);
      if (foundIndex < 0) return;
      console.log(foundIndex + " FOUND INDEX");
      return gifts[foundIndex];
    }

>>>>>>> c673cd405f68c2af9d19613cc5647990c3de2dbb
  /**
   * Add a giftin the DB and returns the added gift (containing a new id)
   * @param {object} body - it contains all required data to create a gift
   * @returns {object} the gift that was created (with id)
   */

  addOne(body) {
    const gifts = parse(this.jsonDbPath, this.defaultGifts);

    // add new gift to the menu
    const newGift = {

      id: this.getNextId(),
      title: escape(body.title),
      image: escape(body.image),
      price: escape(body.price),
      reserved: escape(body.reserved),
      url: escape(body.url),
      idAmazon: escape(body.idAmazon)
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