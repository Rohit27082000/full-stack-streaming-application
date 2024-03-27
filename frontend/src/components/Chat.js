import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        try {
            const response = await axios.post('/chat/send', { message });
            console.log(response.data); // Handle response
            setMessages([...messages, { text: message, sender: 'me' }]);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error.response.data.message);
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <span>{msg.sender}: </span>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
