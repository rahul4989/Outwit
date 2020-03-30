var express=require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static('public'))

app.set('view engine','ejs')

app.get('/',(req,res)=>{
  res.render('index')
})
users=[];
io.on('connection',(socket)=>{
  console.log('a user connected');
  socket.on('setUsername',(data)=>{
    if(users.indexOf(data)>-1){
      socket.emit('userExists',data + ' username is already taken!Try some other username');
    }
    else{
      users.push(data);
      socket.emit('userSet',{username:data});
    }
  })
  socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
   socket.on('sendans',(data)=>{

     io.sockets.emit('recievedans',{answer:data});
   })
   socket.on('sendques',(data)=>{
     io.sockets.emit('recievedques',data)
   })
   socket.on('userAnswerSubmit',(data)=>{
     io.sockets.emit('userAnswerrecieved',data);
   })
})
var port= process.env.PORT || 3000;
server.listen(port,()=>{
  console.log('listening on port 3000');
})
