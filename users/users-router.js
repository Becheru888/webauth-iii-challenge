const router = require('express').Router();

const Users = require('./users-model');
const secret = require('../api/secret')

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const restricted = require('../api/restricted-mdw');
const checkRole = require('../api/user-role-mdw');

router.get('/', restricted, checkRole, (req, res) => {
  Users.find(req.decodedToken.roles[0])
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});


router.post("/register", (req, res) => {
  const user = req.body;
  user.department = user.department ? user.department : "Back-End";
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome, ${user.username}`,
          token
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials."
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    roles: [user.department],
  };

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, secret.jwtSecret, options);
}


module.exports = router