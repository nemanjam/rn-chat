import { ApolloServer } from 'apollo-server';
import jwt from 'express-jwt';

import { typeDefs } from './data/schema';
import { mocks } from './data/mocks';
import { resolvers } from './data/resolvers';
import { JWT_SECRET } from './config';
import { UserModel } from './data/connectors';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, connection }) => {
    if (connection) {
      return {};
    }

    const user = new Promise((resolve, reject) => {
      jwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
      })(req, res, e => {
        if (req.user) {
          resolve(UserModel.findOne({ where: { id: req.user.id } }));
        } else {
          resolve(null);
        }
      });
    });
    return { user };
  },
});

let port = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 80;
}

server.listen(port).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Apollo server ready on ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
