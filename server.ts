import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { setupSocket } from './src/lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  });

  setupSocket(io);

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
