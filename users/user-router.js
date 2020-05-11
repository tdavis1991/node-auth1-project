const express = require('express')
const router = express.Router()

const Users = require("./user-model");

function protected(req, res, next) {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(401).json({ message: 'you have no session here' })
  }
}

router.get("/", protected, (req, res) => {
  Users.find()
    .then(users => {
      console.log(users)
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;