const jwt = require("jsonwebtoken");

module.exports = function (
  req,
  res,
  next
) {
  try {
    const token =
      req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "Decoded User:",
      decoded
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Invalid Token"
    });
  }
};