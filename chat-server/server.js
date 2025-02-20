const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('message', (message) => {
    console.log('Mensaje recibido:', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Escuchar el evento de cierre del proceso
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Manejar la terminación del servidor correctamente
const shutdown = () => {
  console.log('❌ Servidor detenido.');
  process.exit(0);
};

// Capturar señales de terminación
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
