const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_KEY } = require("../config");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_TOKEN_KEY, (err, decode) => {
    if (err) return res.sendStatus(403);
    req.user = decode.user;
    next();
  });
};

module.exports = verifyJWT;
