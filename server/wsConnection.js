const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4001 }, () => {
  console.log('WebSocket server started on ws://localhost:4001');
});

wss.on('connection', (ws) => {
  console.log('New connection');
  
  // Обработка сообщений от клиента или администратора
  ws.on('message', (message) => {
    console.log('Received message: ', message);
    const lowerMessage = message.toString().toLowerCase();
    
    if (lowerMessage.includes('hello')) {
      ws.send('Hello from the server!');
    } else {
      ws.send('Message received: ' + message);
    }
  });

  // Отправка приветственного сообщения
  ws.send('Welcome to the chat!');
});
