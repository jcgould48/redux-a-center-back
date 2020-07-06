
const dbErrorHelper = require("../../lib/dbErrorHelpers/dbErrorHelper");
const User = require("../../users/model/User");
const Item = require("../model/Item");


module.exports = {
    createItem: async (req, res) => {
        try {
          const newItem = new Item({
            itemName: req.body.itemName,
            rentAmount: req.body.rentAmount,
            description: req.body.description,
            dateInput: req.body.dateInput,
            availability: req.body.availability, 
            createdBy: req.user._id,
          });
          const savedItem = await newItem.save();
          const foundUser = await User.findById({ _id: req.user._id });
          foundUser.itemsCreated.push(savedItem);
          await foundUser.save();
          res.json(savedItem);
        } catch (e) {
          res.status(500).json({
            message: dbErrorHelper(e),
          });
        }
      },

getAllItems: async (req, res) => {
    try {
        // console.log("user id?", req.user._id )
        let allItems = await Item.find({})
    //    console.log("%%%%%",allItems)
        res.json(allItems);
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },

rentItem: async (req, res) => {
    try {
        const itemID = req.body._id;
        // console.log("ITEMBE", req.body)
        let updatedItem = await Item.findByIdAndUpdate(
          {
            _id: itemID,
          },
          { availability: false }
        );
        const foundUser = await User.findById({ _id: req.user._id });
          foundUser.itemsRented.push(itemID);
          await foundUser.save();
        res.json(updatedItem);
      } catch (e) {
        res.status(500).json(dbErrorHelper(e));
      }
  },
waitListItem: async (req, res) => {
try {
    const itemID = req.body._id;
    const foundUser = await User.findById({ _id: req.user._id });
        foundUser.itemsWaitListed.push(itemID);
        await foundUser.save();
    res.json(updatedItem);
    } catch (e) {
    res.status(500).json(dbErrorHelper(e));
    }
},
returnItem: async (req, res) => {
    try {
        const itemID = req.body._id;
        // console.log("ITEMBE", req.body)
        let updatedItem = await Item.findByIdAndUpdate(
          {
            _id: itemID,
          },
          { availability: true }
        );
        const foundUser = await User.findById({ _id: req.user._id });
        const index = foundUser.itemsRented.indexOf(itemID);
        // console.log("INDEXXXX",index)
        if (index > -1) {
            foundUser.itemsRented.splice(index, 1);
          }
        await foundUser.save();
        res.json(updatedItem);
      } catch (e) {
        res.status(500).json(dbErrorHelper(e));
      }
  },

}