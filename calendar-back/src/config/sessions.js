'use strict';

module.exports.sessions = {
  secret: '9b10092045b0a8c48082b0f9a33a50c4',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // maxAge: 24 * 60 * 60 * 1000, //TODO: change to 1 hour
    // maxAge: 1 * 1000,
    maxAge: 60 * 60 * 1000,

    // Prod
    // secure: true,

    // Dev
    secure: false
  },

  // session DB MongoDB
  store: new MongoStore({mongooseConnection: Mongoose.connection})
};