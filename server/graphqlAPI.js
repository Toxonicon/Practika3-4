const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

// Массив для хранения товаров (замените на базу данных в реальном проекте)
let products = [
  { id: 1, name: 'Product 1', price: 100, description: 'Description 1' },
  { id: 2, name: 'Product 2', price: 200, description: 'Description 2' },
];

// GraphQL схема
const typeDefs = gql`
  type Product {
    id: Int
    name: String
    price: Int
    description: String
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(name: String!, price: Int!, description: String!): Product
  }
`;

// Резолверы для обработки запросов
const resolvers = {
  Query: {
    products: () => products,
  },
  Mutation: {
    addProduct: (_, { name, price, description }) => {
      const newProduct = {
        id: products.length + 1,
        name,
        price,
        description,
      };
      products.push(newProduct);
      return newProduct;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
