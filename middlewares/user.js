const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");

function verifyTokenAsync(token, secret) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(decoded);
      }
    });
  });
}
async function userMiddleware(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedData = await verifyTokenAsync(token, JWT_USER_SECRET);
    req.user = decodedData;
    next();
  } catch (error) {
    res.status(403).json({
      msg: "Invalid or expired token!!!!",
    });
  }
}
module.exports = {
  userMiddleware,
};
