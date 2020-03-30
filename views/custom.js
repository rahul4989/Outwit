
     var socket = io();
     function setUsername(){
       socket.emit('setUsername',document.getElementById('name').value);
     };
     var user;
     socket.on('userExists',function(data){
       document.getElementById('error-container').innerHTML=data;
     })
     socket.on('userSet',(data)=>{
       user=data.username;
       document.getElementById('container').innerHTML='<input type = "text" id = "message">\
        <button type = "button" name = "button" onclick = "sendMessage()">Send</button>\
        <div id = "message-container"></div>\
        <button type="button" name="button" onclick="startGame()">Start!</button>';
     })
     socket.on('recievedques',(data)=>{
       console.log(data);
       document.getElementById('container').innerHTML='<p>'+data.ques+'</p>\
       <input id="answer" type="text" placeholder="your fake answer" name="option"/>\
       <button type="button" name="button" onclick="setAnswer()">submit</button>\
       <form id="answers"><button type="button" name="button" onclick="display()">Submit My answer</button></form>\
       <ul id="useranswers"></ul>';
     })
     function sendMessage() {
      var msg = document.getElementById('message').value;
      if(msg) {
         socket.emit('msg', {message: msg, user: user});
      }
   }
   socket.on('newmsg', function(data) {
      if(user) {
         document.getElementById('message-container').innerHTML += '<div><b>' +
            data.user + '</b>: ' + data.message + '</div>'
      }
    })
    socket.on('userAnswerrecieved',(data)=>{
      var ul = document.getElementById("useranswers");
      var li = document.createElement("li");
li.appendChild(document.createTextNode(data.username+" Selected "+data.answer+" as their answer"));
ul.appendChild(li);
    })
      socket.on('recievedans',(data)=>{
        console.log(data.answer.answer)
        if(user){

console.log(user);
  var radiobox = document.createElement('input');
  radiobox.type = 'radio';
  radiobox.name='ans';
  radiobox.id=data.answer.answer;
  radiobox.value = data.answer.answer;
  radiobox.onclick="handle(this)";

var label=document.createElement('label')
label.htmlFor=data.answer.answer;

var d=data.answer.answer;
var description=document.createTextNode(d);
label.appendChild(description);


  var newline = document.createElement('br');

  var container = document.getElementById('answers');
  container.appendChild(radiobox);
  container.appendChild(label);
  container.appendChild(newline);
}




   })
   function startGame(){
     fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      socket.emit('sendques',{ques:data.results[0].question})


    })
   }
   function setAnswer(){
     var answer=document.getElementById('answer').value;
     socket.emit('sendans',{answer:answer});
   }
 function display(){
   var checkRadio = document.querySelector(
               'input[name="ans"]:checked');

           if(checkRadio != null) {

                   console.log(checkRadio.value);
                   console.log(user);

                   socket.emit('userAnswerSubmit',{answer:checkRadio.value,username:user})

           }
           else {
               console.log('no value selected')
           }

 }
