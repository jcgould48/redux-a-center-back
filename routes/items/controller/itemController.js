const dbErrorHelper = require("../../lib/dbErrorHelpers/dbErrorHelper");
// const Twilio = require("twilio");
const sgMail = require('@sendgrid/mail');
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

    console.log("Test to work")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'jesse.gould@codeimmersives.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    
    sgMail.send(msg);

    // const itemID = req.body._id;
    // const foundUser = await User.findById({ _id: req.user._id });
    //     foundUser.itemsWaitListed.push(itemID);
    //     await foundUser.save();
    // // res.json(updatedItem);
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

removeWaitList: async (req, res) => {
    try {
        const foundUser = await User.findById({ _id: req.user._id });
        // console.log("INDEXXXX",foundUser)
        const index = await foundUser.itemsWaitListed.indexOf(itemID);
        console.log("INDEXXXX",index)

        if (index > -1) {
            foundUser.itemsWaitListed.splice(index, 1);
          }
        await foundUser.save();
        res.json(foundUser);
      } catch (e) {
        res.status(500).json(dbErrorHelper(e));
      }
  },
deleteItem: async (req, res) => {
    try {
        const itemID = req.params.id;
        // console.log("ITEMBE", itemID)
        const foundUser = await User.findById({ _id: req.user._id });
        const index = foundUser.itemsCreated.indexOf(itemID);
        // console.log("INDEXXXX",index)
        if (index > -1) {
            foundUser.itemsCreated.splice(index, 1);
        }
        await foundUser.save();
        let deletedItem = await Item.findByIdAndDelete({ _id: itemID});
        res.json(deletedItem);
      } catch (e) {
        res.status(500).json(dbErrorHelper(e));
      }
  },

  getAllProfileItems: async (req, res) => {
    try {
        // const itemID = req.body._id;
        const foundUser = await User.findById({ _id: req.user._id });
        const rented = foundUser.itemsRented;
        const created = foundUser.itemsCreated;
        const waitListed = foundUser.itemsWaitListed;
        // console.log("RENTED Array?", rented )
    //   console.log(foundAllRented);
    rentRecords = await Item.find().where('_id').in(rented).exec();
    createdRecords = await Item.find().where('_id').in(created).exec();
    waitListRecords = await Item.find().where('_id').in(waitListed).exec();
      const ownerObj = {
        rented: rentRecords,
        created:createdRecords,
        waitListed:waitListRecords
    }
    res.json(ownerObj);
     
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },

}