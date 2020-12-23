const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const PORT = 4567
const cors = require('cors')
const morgan = require('morgan')
const socket = require('socket.io')
const { emit } = require('process')
const modelMessage = require('./src/model/message')
const moment = require('moment')
moment.locale('id');
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
    socket.join('room:'+dataUser.room)
    console.log('user :'+dataUser.username + ' join ke '+dataUser.room);
    socket.broadcast.to('room:' + dataUser.room).emit('kirimKembali', `Both: ${dataUser.username} join group `)
  })

  socket.on('reciverMessage',(data, callback)=>{
    console.log('data yg dikirim dari client = '+data);
    // callback(data.message)
    // const data = {
    //   bodyMessage: '',
    //   senderId: 1,
    //   reciverId: 2
    // }
    // modelMessage.insertMessage(bodyMessage)
    // .then((res)=>{

    // })

    const formatMessage = {
      message: data.message,
      senderId: data.senderId,
      time: moment(new Date()).format('LT')
    }
    console.log(formatMessage);
    socket.broadcast.to('room:' + data.room).emit('kirimKembali', formatMessage)
    socket.emit('kirimKembali', formatMessage)
    
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