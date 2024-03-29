const { ApolloServer, AuthenticationError } = require('apollo-server');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const { FormatDateDirective, AuthenticationDirective, AuthorizationDirective } = require('./directives')
const { createToken, getUserFromToken } = require('./auth');
const db = require('./db');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective,
    dateFormat: FormatDateDirective,
    authentication: AuthenticationDirective,
    authorization: AuthorizationDirective
  },
  context({ req, connection }) {
    const context = { ...db };
    if (connection) {
      return { ...context, ...connection.context };
    }
    const token = req.headers.authorization;
    const user = getUserFromToken(token);
    return { ...db, user, createToken };
  },
  subscriptions: {
    onConnect(params) {
      const token = params.authToken;
      const user = getUserFromToken(token);
      return { user };
    },
  },
});

server.listen(4000).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
});
