const router = require('express').Router();

const Users =  require('./users-model');



router.get('/',  (_, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });