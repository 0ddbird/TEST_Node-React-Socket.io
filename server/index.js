import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { v4 as uuid} from 'uuid'

const port = 3001
const app  = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
})
io.on('connection', socket => {
  console.log('a user connected');
  
  socket.on('disconnect', reason => {
    console.log('a user disconnected');
  });

  socket.on('join_room', data => {
    console.log('room join');
    console.log(data);
    socket.join(data.room);
  });

  socket.on('leave room', data => {
    console.log('leaving room');
    console.log(data);
    socket.leave(data.room)
  });

  socket.on('new message', data => {
    console.log(data.room);
    socket.broadcast
    .to(data.room)
    .emit('receive message', data)
  });
});

server.listen(port);