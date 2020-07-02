const express = require('express');
const router = express.Router();
const itemController = require("./controller/itemController")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-item", itemController.createItem);

router.get('/all-rental-items', itemController.getAllItems)
module.exports = router;
