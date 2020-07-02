
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
           
          });
          const savedItem = await newItem.save();
        //   const foundUser = await User.findById({ _id: req.user._id });
        //   foundUser.items.push(savedItem._id);
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

}