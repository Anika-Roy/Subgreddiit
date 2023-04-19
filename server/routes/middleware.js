const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  // console.log("req:", req.headers['authorization'])
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(401).send({
      message: 'No token provided'
    });
  }

  const bearer = bearerHeader.split(' ');
  // console.log("bearer[1]:", bearer[1][0])
  const bearerToken = bearer[1];
  // console.log(bearerToken[0])

  try {
    // console.log(process.env.SECRET_KEY)
    const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
    // console.log("decoded.id", decoded.id)
    req.id = decoded.id;
  
    // console.log("req.id",req.id)
    next();
  } catch (err) {
    return res.status(401).send({
      message: 'Token is not valid'
    });
  }
};

// module.exports = function verifyModeratorRole(req, res, next) {
//   console.log(req)
//   next();
// };