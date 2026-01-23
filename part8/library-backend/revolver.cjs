const { GraphQLError } = require("graphql");
const Author = require("./models/author.cjs");
const Book = require("./models/book.cjs");
const User = require("./models/user.cjs");
const jwt = require("jsonwebtoken");

const userValidation = (context) => {
  if (!context.currentUser) {
    throw new GraphQLError("User is invalid or not authorised", {
      extensions: { code: "INVALID_AUTHORISATION" },
    });
  }
  return;
};

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({});
      return books.length;
    },

    authorCount: async () => {
      const authors = await Author.find({});
      return authors.length;
    },

    allBooks: async (_root, args) => {
      const { author, genre } = args;
      let searchParam = {};

      if (author) {
        const authorFound = await Author.findOne({ name: author });
        if (authorFound) searchParam.author = authorFound._id;
      }

      if (genre) searchParam.genres = genre;
      const books = await Book.find(searchParam).populate("author");
      return books;
    },

    allAuthors: async () => await Author.find({}),

    me: async (_root, _args, context) => {
      console.log(context.currentUser.favoriteGenre.length);
      return context.currentUser;
    },
  },

  Author: {
    bookCount: async (root) => {
      const authorBooks = await Book.find({ author: { _id: root._id } });
      return authorBooks.length;
    },
  },

  Mutation: {
    addBook: async (_root, args, context) => {
      console.log(args);
      userValidation(context);

      const existingAuthor = await Author.findOne({ name: args.author });
      // Add author if it is not existed
      let authorId = "";
      if (!existingAuthor) {
        const author = new Author({ name: args.author });
        const newAuthor = await author.save();
        authorId = String(newAuthor._id);
      } else {
        authorId = String(existingAuthor._id);
      }

      //Add the book to DB
      const book = new Book({ ...args, author: authorId });
      try {
        const saveBook = await book.save();
        return saveBook.populate("author");
      } catch (error) {
        console.log(error);
        throw new GraphQLError("Unable to add book", {
          extensions: {
            code: "BAD_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    editAuthor: async (_root, args, context) => {
      userValidation(context);

      const { name, setBornTo } = args;
      const found = await Author.findOne({ name });
      if (!found) return null;

      found.born = setBornTo;
      try {
        const saveAuthor = await found.save();
        return saveAuthor;
      } catch (error) {
        console.log(error);
        throw new GraphQLError("Unable to edit author", {
          extensions: {
            code: "BAD_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    createUser: (_root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      });
    },

    login: async (_root, args) => {
      console.log(args);
      const { username, password } = args;
      const user = await User.findOne({ username });

      if (!user || password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

module.exports = resolvers;
