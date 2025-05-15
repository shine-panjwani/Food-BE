const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

function verifyTokenAsync(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedData = await verifyTokenAsync(token, JWT_ADMIN_SECRET);
    req.user = decodedData;
    next();
  } catch (error) {
    res.status(403).json({
      msg: "Invalid or expired token!!!!",
    });
  }
}
module.exports = {
  adminMiddleware,
};
