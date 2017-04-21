import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const getStrategy = (models, email, password, done) => {
  const { User } = models;
  User.findOne({
    where: { email }
  }).then(user => {
    console.log(user.toJSON());
    return done(null, user);
  });
};

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log('hi?????????');
      return next();
    }
    res.redirect('/');
  }
}

export const initStrategy = (models) => {
  const { User } = models;
  
  passport.use(new LocalStrategy(
    {usernameField: 'username', passwordField: 'password'},
    (username, password, done) => getStrategy(models, username, password, done))
  );

  passport.serializeUser(function (user, cb) {
    cb(null, user.email);
  })

  passport.deserializeUser(function (id, done) {
      console.log(id);
      User.findOne({
        where: { email: id }
      }).then(user => done(null, user.email));
  });


  passport.authenticationMiddleware = authenticationMiddleware;
};

