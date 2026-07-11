const { PORT } = require('./config/env');
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

const server = http.createServer(app);

// Initialize Sockets
initSocket(server);

// Connect DB & Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
