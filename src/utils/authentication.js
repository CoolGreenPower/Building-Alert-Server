const jwt = require('jsonwebtoken');
//const { VAR_SECRET } = require('../modules/ApplicationPropertiesSingleton')

const verifyToken = async(req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) { return res.status(401).json("Not authenticated"); }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) { return res.status(403).json("Token invalid"); }
    
    req.user = user;
    next()
  })
}


/*
Deprecated as of 6/13/2023. Very similar to verifyToken, but this uses headers instead of cookies
*/
function authenticateToken(req, res, next) {
  const token = req.headers['x-auth-token']

  if (token == null) return res.status(401).send({
      "Error" : "Token not present. Could not be authenticated"
  })

  jwt.verify(token, VAR_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.status(403).send({
        "Error" : "Token did not match records"
    })

    next()
  })
}

module.exports = verifyToken;