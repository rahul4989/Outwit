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
pusers={};
sol=[];
var total=0;
io.on('connection',(socket)=>{
  console.log('a user connected');
  socket.on('setUsername',(data)=>{

    if((Object.values(pusers)).indexOf(data)>-1){
      socket.emit('userExists',data + ' username is already taken!Try some other username');
    }
    else{
      users.push(data);
      //console.log(data+"data");
      pusers[socket.id]=data;
      //console.log(Object.values(pusers));
      //console.log(pusers);
      socket.emit('userSet',{username:data});

    }
  })
  socket.on('onlinepeeps',(data)=>{
    io.sockets.emit('onlinepeople',{users:Object.values(pusers)})
  })
  socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
   socket.on('sendans',(data)=>{
console.log(data);
obj={
  username:data.user,
  answer:data.answer,
  count:0
}
sol.push(obj);

     io.sockets.emit('recievedans',{answer:data.answer});
   })
   socket.on('sendques',(data)=>{
     sol=[]
     total=0;
     io.sockets.emit('recievedques',data)
   })
   socket.on('userAnswerSubmit',(data)=>{
     var p=sol.findIndex(x=>x.answer==data.answer);
     sol[p].count++;
     total++;
     console.log(sol);
     io.sockets.emit('userAnswerrecieved',data);
   })
   socket.on('checkresult',(data)=>{
   var ok=(Math.max.apply(Math, sol.map(function(obj) { return obj.count; })))
   if(total==sol.length){
     var index=sol.findIndex(x=>x.count==ok);
     var k=sol[index];
     io.sockets.emit('finalres',k);
   }
   })
   socket.on('disconnect', function(){
    console.log('user ' + pusers[socket.id] + ' disconnected');

    delete pusers[socket.id];
    io.sockets.emit('onlinepeople',{users:Object.values(pusers)})
    console.log(Object.values(pusers))
  });
})
var port= process.env.PORT || 3000;
server.listen(port,()=>{
  console.log('listening on port 3000');
})
