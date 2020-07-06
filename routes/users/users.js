const express = require('express');
const router = express.Router();
const userController = require("./controller/userController")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/sign-up", userController.signUp);
router.post("/login", userController.login);

router.put('/update-profile', userController.updateProfile)
router.get('/update-profile', userController.updateProfile)

module.exports = router;
