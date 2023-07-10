const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Define the resolver for the "user" query
    user: async (parent, { id, username }) => {
      // Get a single user by either their id or username
      const foundUser = await User.findOne({
        $or: [{ _id: id }, { username: username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find a user with this id or username');
      }

      return foundUser;
    },
  },
  Mutation: {
    // Define the resolver for the "createUser" mutation
    createUser: async (parent, { input }) => {
      // Create a user
      const user = await User.create(input);

      if (!user) {
        throw new Error('Something went wrong. User creation failed');
      }

      // Sign a token
      const token = signToken(user);

      return { token, user };
    },
    // Define the resolver for the "login" mutation
    login: async (parent, { input }) => {
      // Find a user by their username or email
      const user = await User.findOne({
        $or: [{ username: input.username }, { email: input.email }],
      });

      if (!user) {
        throw new Error("Can't find this user");
      }

      // Check password validity
      const correctPw = await user.isCorrectPassword(input.password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      // Sign a token
      const token = signToken(user);

      return { token, user };
    },
    // Define the resolver for the "saveBook" mutation
    saveBook: async (parent, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication failed. Please login');
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (error) {
        throw new Error('Book saving failed');
      }
    },
    // Define the resolver for the "deleteBook" mutation
    deleteBook: async (parent, { bookId }, { user }) => {
      if (!user) {
        throw new Error('Authentication failed. Please login');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id");
      }

      return updatedUser;
    },
  },
};

module.exports = resolvers;
