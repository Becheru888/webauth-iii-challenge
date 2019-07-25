const jwt = require("jsonwebtoken");
const secret = require('./secret')

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          message: "You shall not pass!"
        });
      } else {
        req.decodedToken = decodedToken;
        console.log("Decode token: ", req.decodedToken);

        next();
      }
    });
  } else {
    res.status(401).json({
      message: "You shall not pass!"
    });
  }
};