import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

const getUserStrategy = (models, email, password, done) => {
  const { User } = models;
  User.findOne({
    where: { email }
  }).then(user => {
    bcrypt.compare(password, user.passwordHash, (err, hash) => {
      console.log('here');
      return hash ? done(null, { user: user, type: 'USER' }) : done(null, false);
    });
  });
};

const getCompanyStrategy = (models, email, password, done) => {
  const { Company } = models;
  Company.findOne({
    where: { email }
  }).then(company => {
    bcrypt.compare(password, company.passwordHash, (err, hash) => {
      return hash ? done(null, { company: company, type: 'COMPANY' }) : done(null, false);
    });
  });
}

function authenticateBy(type) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.$modelOptions.name.singular === type) {
      return next();
    }
    res.sendStatus(403);
  }
}

export const initStrategy = (models) => {
  const { User, Company } = models;

  passport.use('local-user', new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    (username, password, done) => getUserStrategy(models, username, password, done)
  ));

  passport.use('local-company', new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    (username, password, done) => getCompanyStrategy(models, username, password, done)
  ));

  passport.serializeUser(function (user, cb) {
    cb(null, user);

  })

  passport.deserializeUser(function(sessionObject, done) {
    const { company, user, type } = sessionObject;
    switch(type) {
      case 'COMPANY': 
        console.log('hye');
        return Company.findOne({
            where: { email: company }
          }).then(companyObj => done(null, companyObj)); 
      case 'USER':
         return User.findOne({
          where: { email: user }
        }).then(userObject => done(null, userObject));   
      default:
        done(null, false);
    }
  });

  passport.authenticateBy = authenticateBy;
};

