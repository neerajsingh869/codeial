class ChatEngine{constructor(e,s){this.chatBox=$(`#${e}`),this.userEmail=s,this.socket=io.connect("http://localhost:5000",{transports:["websocket","polling","flashsocket"]}),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(()=>{console.log("connection established using sockets...!"),e.socket.emit("join_room",{user_emai:e.userEmail,chatroom:"codeial"}),e.socket.on("user_joined",(e=>{console.log("a user joined ",e)}))})),$("#send-message").click((()=>{let s=$("#chat-message-input").val();""!=s&&e.socket.emit("send_message",{message:s,user_email:e.userEmail,chatroom:"codeial"})})),e.socket.on("receive_message",(s=>{console.log("message received",s.message);let o=$("<li>"),t="other-message";s.user_email===e.userEmail&&(t="self-message"),o.append($("<span>",{html:s.message})),o.addClass(t),$("#chat-messages-list").append(o)}))}}