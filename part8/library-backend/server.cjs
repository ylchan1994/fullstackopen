const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./schema.cjs");
const resolvers = require("./revolver.cjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user.cjs");

const getUserFromAuthHeader = async (bearer) => {
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return null;
  }
  const token = bearer.substring(7);
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return await User.findOne({ _id: user.id });
};

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      console.log("Variables: ", req.body.variables);
      console.log(req.body.query);
      const bearer = req.headers.authorization;
      const currentUser = await getUserFromAuthHeader(bearer);
      return { currentUser };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer;
