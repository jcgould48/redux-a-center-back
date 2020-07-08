const express = require('express');
const router = express.Router();
var passport = require("passport");
const itemController = require("./controller/itemController")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-item", 
passport.authenticate("jwt-user", { session: false }),
itemController.createItem);

router.get('/all-rental-items',
passport.authenticate("jwt-user", { session: false }),
itemController.getAllItems)

router.put('/rent-item',
passport.authenticate("jwt-user", { session: false }),
itemController.rentItem)

router.put('/wait-list-item',
passport.authenticate("jwt-user", { session: false }),
itemController.waitListItem)

router.put('/return-item',
passport.authenticate("jwt-user", { session: false }),
itemController.returnItem)

router.put('/remove-wait-list',
passport.authenticate("jwt-user", { session: false }),
itemController.removeWaitList)

router.delete('/delete-item/:id',
passport.authenticate("jwt-user", { session: false }),
itemController.deleteItem)

router.get('/all-profile-items',
passport.authenticate("jwt-user", { session: false }),
itemController.getAllProfileItems)

module.exports = router;
