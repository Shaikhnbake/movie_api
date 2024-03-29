const jwtSecret = 'your_jwt_secret';
//HAS TO MATCH SAME KEY AS JWTStrategy:secretOrKey !!

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); //LOCAL PASSPORT FILE

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, //username encoded in JWT
    expiresIn: '7d', //token expires in 7 days
    algorithm: 'HS256' //algorithm used to "sign" or encode values of JWT
  });
}

// POST LOGIN

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => {
      if (error || !user){
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, {session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.json({ user, token });
      });
    })(req, res);
  });
}
