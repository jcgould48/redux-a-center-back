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

  getAllProfileItems: async (req, res) => {
    try {
        const newArr=[]
        const itemID = req.body._id;
        const foundUser = await User.findById({ _id: req.user._id });
        const rented = foundUser.itemsRented;
        const created = foundUser.itemsCreated;
        // console.log("RENTED Array?", rented )
        // let foundAllRented = await User.findById({ _id: req.user._id  })
        // .populate("Rented")
        // .select("-__v -password -userCreated -email -username");


    //   console.log(foundAllRented);
    records = await Item.find().where('_id').in(rented).exec();
    recordsA = await Item.find().where('_id').in(created).exec();
      newArr.push(records) 
      newArr.push(recordsA) 
      console.log("ARRR",newArr) 
    //    await rented.forEach(element => {
    //     console.log("ELEMENT", element)
    //     let foundNewItem= Item.findById({ _id: element}); 
    //     newArr.push(foundNewItem)
    // });
      
    //   Item.findById({ _id: rented[0] })
      console.log("Please",records);
    //   .populate("expenses")
    //   res.json(foundAllRented);
        // await rented.forEach(element => {
        // let foundItem= Item.findById({ _id: element}); 
        // console.log("this is it", foundItem)
        // console.log("this is it", foundItem.obj.itemName)
    // });
    // console.log("FOUND_ITEM?", foundItems ) 
    // res.json(foundItems)
    //     let allItems = await Item.find({})
    // //    console.log("%%%%%",allItems)
    //     res.json(allItems);
    } catch (e) {
      res.status(500).json({
        message: dbErrorHelper(e),
      });
    }
  },

}