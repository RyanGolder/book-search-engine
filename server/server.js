const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas/schemas');
const { authMiddleware } = require('./utils/auth');
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();

  server.applyMiddleware({ app });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  await new Promise(resolve => app.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
