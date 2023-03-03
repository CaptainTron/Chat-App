const socket = io();

window.addEventListener('DOMContentLoaded',()=>{
  let person = prompt("Your Name");
  if(person){
    socket.emit('UserConnected',person);
    let Name = document.querySelector('.nameheader')
    Name.innerHTML = `Hello ${person}`;
    document.title = `${person}`
  }else{
    alert("Enter Your Name")
    location.reload();
  }
})
// // Naming Headesod
// This will Get the Time for Section
function Time(){
    let date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + '' + ampm;
    return strTime;
}
// Typing... Functionality Goes Here

    // Typing Functionality Goes Here

    var messages = document.getElementById('messages');
    let form = document.getElementById('form')
    let input = document.getElementById('input')

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(input.value){
      let item = document.createElement('li')
      item.textContent = `${input.value} -${Time()}`;
      item.style.background = "lightblue";
      item.style.color = 'black';
      item.style.textAlign = 'right';
      messages.appendChild(item)
      messages.scrollTop = messages.scrollHeight;
      socket.emit('Chat Message', input.value);
        input.value = '';
        input.blur();
      }
    });

    input.addEventListener('focus',(e)=>{
      socket.emit('Typing')
      // alert(e)
    })

    socket.on('UserTyping',(Name)=>{
      let item = document.createElement('li')
      item.textContent = `${Name} is Typing....`;
      item.style.color = "gray";
      messages.appendChild(item)
      messages.scrollTop = messages.scrollHeight;
    })
    socket.on('Msg',(msg)=>{
      let item = document.createElement('li')
      item.textContent = `${msg.Msg}    ~${msg.From} - ${Time()}`;
      messages.appendChild(item)
      messages.scrollTop = messages.scrollHeight;
    })
    
    socket.on('UserConnect',(User)=>{
      let item = document.createElement('li')
      item.textContent = `${User} Joined The Chat -${Time()}`;
      item.style.color = 'yellow';
      item.style.textAlign = 'center';
      messages.appendChild(item)
      messages.scrollTop = messages.scrollHeight;
    })

    // When a User Leave this will fire up
    socket.on('Leave',(User)=>{
      let item = document.createElement('li')
      item.textContent = `${User} Left The Chat - ${Time()}`;
      item.style.color = 'red';
      item.style.fontWeight = "bolder"
      item.style.textAlign = 'center';
      messages.appendChild(item)
      messages.scrollTop = messages.scrollHeight;
    })
let ActiveUser = document.querySelector('.Users')
// List of all the active users
socket.on('ActiveUsers',(ActiveUsers)=>{
  ActiveUser.innerHTML = "";
  for(let i = 0;i<ActiveUsers.length;i++){
    let item = document.createElement('li')
    item.textContent = ActiveUsers[i] + ` 🟢 `;
    ActiveUser.appendChild(item);
  }
})


