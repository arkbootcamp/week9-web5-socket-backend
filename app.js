const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const PORT = 4567
const cors = require('cors')
const morgan = require('morgan')
const socket = require('socket.io')
const { emit } = require('process')

app.use(cors())
app.use(morgan('dev'))
// initial socket
const io = socket(server, {
  cors: {
    origin: '*',
  }
})

// untuk socket
io.on("connection", (socket) => {
  console.log('ada client yang connect '+socket.id);

  socket.on('initialUser', (dataUser)=>{
    socket.join('12312')
    console.log('user :'+dataUser.username + ' join ke '+dataUser.room);
    socket.broadcast.to('room:' + dataUser.room).emit('kirimKembali', `Both: ${dataUser.username} join group `)
  })

  socket.on('reciverMessage',(data)=>{
    console.log('data yg dikirim dari client = '+data);

    io.to('room:'+data.room).emit('kirimKembali', data.message)
  })

  socket.on("disconnect", () => {
   console.log('clien terputus')
  });
});


app.get('/tes', (req, res)=>{
  res.json(
    {name: 'muhammad risano akbar',
    email: 'muhammadrisnao@gmail.com'
  }
  )
})
server.listen(PORT, ()=>{
  console.log(`server is running port ${PORT}`);
})