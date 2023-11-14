import auth0Strategy from 'passport-auth0';

export const strategy = new auth0Strategy({
  domain: 'thesis-management-05.eu.auth0.com',
  clientID: 'aLJmcMkDJkpc8Rql8EfxLVl4ND9aUyWp',
  clientSecret: 'ZNqGAzme8S6TBGJ_rMB3NfcAJgZnCikGWRB0nCkswCwjWQ7oacFDh3D_gHVYmaOj',
  callbackURL: 'http://localhost:3001/api/users/login/callback',
  scope: 'openid profile email',
  credentials: true
},
  function (accessToken, refreshToken, extraParams, profile, done) {
      return done(null, profile.nickname);
  }
);

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};
