import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const getUserStrategy = (models, email, password, done) => {
  const { User } = models;
  console.log(email, password, 'hhhhhhhhhh');
  User.findOne({
    where: { email }
  }).then(user => {
    console.log('a user');
    return done(null, { user, type: 'USER' });
  });
};

const getCompanyStrategy = (models, email, password, done) => {
  const { Company } = models;
  Company.findOne()
    .then(company => {
      return done(null, company);
    });
}

function authenticateUser() {
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

  passport.use('local-user', new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    (username, password, done) => getUserStrategy(models, username, password, done)
  ));

  passport.use('local-company', new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    (username, password, done) => getCompanyStrategy(models, username, password, done)
  ));

  passport.serializeUser(function (user, cb) {
    console.log(user, 'mooooooooooooooosssssssssssssssss');
    cb(null, user);
  })

  passport.deserializeUser(function(sessionObject, done) {
    const { user, userType } = sessionObject;
    console.log(user, userType, 'mooshshshsh');
    switch(userType) {
      default:
         User.findOne({
          where: { email: user.email }
        }).then(user => done(null, user));   
    }
  });

  passport.authenticateUser = authenticateUser;
};

