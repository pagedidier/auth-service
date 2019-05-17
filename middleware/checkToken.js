const jwt = require('jsonwebtoken');

const { secret } = require(`${__dirname}/../config/config.json`);

exports.checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: 'Token is not valid',
          error: true,
          data: null,
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      error: true,
      message: 'Auth token is not supplied',
      data: null,
    });
  }
};
