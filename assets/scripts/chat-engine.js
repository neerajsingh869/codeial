class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${ chatBoxId }`);
        this.userEmail = userEmail;

        // to initiate connection or send a connection request to server
        // emitting connection request from subscriber
        this.socket = io.connect('http://13.53.190.211:5000', { transports : ['websocket', 'polling', 'flashsocket'] });

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    // method to detect if connection is established or not
    // notified by observer if emitted connection request is established or not
    connectionHandler() {
        let self = this;

        this.socket.on('connect', () => {
            console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                user_emai: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', (data) => {
                console.log('a user joined ', data);
            })  
        });

        $('#send-message').click(() => {
            let msg = $('#chat-message-input').val();

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', (data) => {
            console.log('message received', data.message);

            let newMessage = $('<li>');

            let newMessageType = 'other-message'
            if (data.user_email === self.userEmail) {
                newMessageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(newMessageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}