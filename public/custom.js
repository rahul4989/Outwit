
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
       console.log(data)
       document.getElementById('buttona').innerHTML='';
       document.getElementById('instructions').innerHTML='';
       document.getElementById('one1').innerHTML='<div class="input-group">\
       <input type = "text" id = "message" class="form-control"placeholder="Type a Message">\
       <span class="input-group-btn">\
        <button type = "button" class="btn btn-outline-primary" name = "button" onclick = "sendMessage()">\
  Send!</button></span></div>\
        <div id = "message-container"></div>';

      document.getElementById('two2').innerHTML='<button type="button"class="btn btn-outline-primary btn-lg btn-block" name="button" onclick="startGame()">Start!</button>\
      <label for="options">Choose a Category:</label>\
      <select id="optionss">\
       <option value="11">Films</option>\
       <option value="12">Music</option>\
       <option value="14">Television</option>\
       <option value="18">Computers</option>\
       <option value="21">Sports</option>\
       <option value="26">Celebrities</option>\
       <option value="23">History</option>\
       <option value="24">Politics</option>\
       <option value="10">Books</option>\
       <option value="9" selected>General Knowledge</option>\
      </select>\
      <label for="optionsss">Difficulty:</label>\
      <select id="doptions">\
      <option value="easy">Easy</option>\
      <option value="medium">Medium</option>\
      <option value="hard">hard</option>\
      </select>';
          document.getElementById('online1').innerHTML='Online Users';
      socket.emit('onlinepeeps',data)



     })
     socket.on('onlinepeople',(data)=>{
       if(user){
       var people=data.users;
       console.log(people[0]);
       document.getElementById('onlinepeople').innerHTML='';
       for(var i=0;i<people.length;i++){
         var ul = document.getElementById("onlinepeople");
   var li = document.createElement("li");
   li.appendChild(document.createTextNode(people[i]));
   ul.appendChild(li);
       }
     }

     })
     socket.on('recievedques',(data)=>{
       console.log(data);
       if(user!==null){
         document.getElementById('popup').innerHTML='';
       document.getElementById('two2').innerHTML='<button type="button" class="btn btn-outline-primary btn-lg btn-block" name="button" onclick="startGame()">Start!</button>\
       <label for="options">Choose a Category:</label>\
       <select id="optionss">\
        <option value="11">Films</option>\
        <option value="12">Music</option>\
        <option value="14">Television</option>\
        <option value="18">Computers</option>\
        <option value="21">Sports</option>\
        <option value="26">Celebrities</option>\
        <option value="23">History</option>\
        <option value="24">Politics</option>\
        <option value="10">Books</option>\
        <option value="9" selected>General Knowledge</option>\
        </select>\
        <label for="optionsss">Difficulty:</label>\
        <select id="doptions">\
        <option value="easy">Easy</option>\
        <option value="medium">Medium</option>\
        <option value="hard">hard</option>\
        </select>\
       <p class="lead">'+data.ques+'</p>\
       <div class="input-group">\
       <input id="answer" class="form-control"type="text" placeholder="Your Answer" name="option"/>\
       <span class="input-group-btn"><button type="button" class="btn btn-outline-primary" name="button" onclick="setAnswer()">Submit</button></span></div>\
       </br>\
       <form id="answers"><div class="form-group"><button id="submitbutton" type="button" class="btn btn-outline-primary " name="button" onclick="display()">Submit My answer</button></div></form>\
       </br>\
       <ul id="useranswers" class="list-group"></ul>';
     }
     })
     function sendMessage() {
      var msg = document.getElementById('message').value;
      if(msg) {
        document.getElementById('message').value='';
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
       li.className = 'list-group-item';
li.appendChild(document.createTextNode(data.username+" Selected "+data.answer+" as their answer"));
ul.appendChild(li);
socket.emit('checkresult',data);
    })
      socket.on('recievedans',(data)=>{
        console.log(data.answer)
        if(user){

console.log(user);
  var radiobox = document.createElement('input');
  radiobox.type = 'radio';
  radiobox.name='ans';
  radiobox.id=data.answer;
  radiobox.value = data.answer;
  radiobox.onclick="handle(this)";

var label=document.createElement('label')
label.htmlFor=data.answer.answer;

var d=data.answer;
var description=document.createTextNode(d);
label.appendChild(description);


  var newline = document.createElement('br');

  var container = document.getElementById('answers');
  container.appendChild(radiobox);
  container.appendChild(label);
  container.appendChild(newline);
}

socket.on('onlineuse',(data)=>{
  console.log(data)
})
socket.on('finalres',(data)=>{
  document.getElementById('popup').innerHTML='<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Winner?</button>';
  document.getElementById('winnername').innerHTML=data.username + ' for the answer '+ data.answer;
})

   })
   function startGame(){
     window.localStorage.removeItem('answer');
     var x=document.getElementById('optionss').value;
     var y=document.getElementById('doptions').value;
     console.log(x);
     fetch('https://opentdb.com/api.php?amount=1&category='+x+'&difficulty='+y+'&type=multiple')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      socket.emit('sendques',{ques:data.results[0].question})


    })
   }
   function setAnswer(){
     var answer=document.getElementById('answer').value;
     if(answer){
     document.getElementById('answer').value='';
     document.getElementById('answer').disabled=true;
     window.localStorage.setItem('answer', answer);
     var data={
       answer:answer,
       user:user
     }
     socket.emit('sendans',data);
   }
   }
 function display(){
   var checkRadio = document.querySelector(
               'input[name="ans"]:checked');

           if(checkRadio != null) {
             var x=window.localStorage.getItem('answer');

                  if(x==checkRadio.value){
                    alert('you cant choose your own answer')
                  }else{
                   console.log(checkRadio.value);
                   console.log(user);
                  document.getElementById('submitbutton').disabled=true;
                   socket.emit('userAnswerSubmit',{answer:checkRadio.value,username:user})
}
           }
           else {
               console.log('no value selected')
           }

 }
