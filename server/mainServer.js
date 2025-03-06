const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Массив для хранения товаров (замените на базу данных в реальном проекте)
let products = [
  { id: 1, name: 'Product 1', price: 100, description: 'Description 1', category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 200, description: 'Description 2', category: 'Furniture' },
];

// GraphQL схема
const typeDefs = gql`
  type Product {
    id: Int
    name: String
    price: Int
    description: String
    category: String
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(name: String!, price: Int!, description: String!, category: String!): Product
  }
`;

// Резолверы для обработки запросов
const resolvers = {
  Query: {
    products: () => products,
  },
  Mutation: {
    addProduct: (_, { name, price, description, category }) => {
      const newProduct = {
        id: products.length + 1,
        name,
        price,
        description,
        category
      };
      products.push(newProduct);
      return newProduct;
    },
  },
};

// Настроить сервер Apollo
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

// Настройка WebSocket
const wss = new WebSocket.Server({ port: 4001 }, () => {
  console.log('WebSocket server started on ws://localhost:4001');
});

wss.on('connection', (ws) => {
  console.log('New connection');

  ws.on('message', (message) => {
    console.log('Received message: ', message);
    ws.send('Message received: ' + message);
  });

  ws.send('Welcome to the chat!');
});
