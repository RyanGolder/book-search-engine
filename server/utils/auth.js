const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models/User');
const { verifyToken } = require('../utils/auth');

const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (context) {
    let token;

    // allows token to be sent via req.body, req.query, or headers
    if (context.req && context.req.headers.authorization) {
      token = context.req.headers.authorization.split(' ')[1];
    } else if (context.connection && context.connection.context.Authorization) {
      token = context.connection.context.Authorization.split(' ')[1];
    }

    // if token is found, verify and decode it
    if (!token) {
      throw new AuthenticationError('You need to be logged in!');
    }

    try {
      const user = verifyToken(token);
      return user;
    } catch (err) {
      console.log(err);
      throw new AuthenticationError('Invalid token!');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
