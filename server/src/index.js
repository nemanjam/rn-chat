import { ApolloServer } from 'apollo-server';
import { typeDefs } from './data/schema';
import { mocks } from './data/mocks';
import { resolvers } from './data/resolvers';

const server = new ApolloServer({ typeDefs, resolvers /*,mocks*/ });

let port = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 80;
}

server
  .listen({ port })
  .then(({ url }) => console.log(`Server ready at ${url}`));
