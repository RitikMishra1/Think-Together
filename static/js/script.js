// script.js
document.addEventListener('DOMContentLoaded', function () {

    const messageInput = document.getElementById('user-message');
    const chatArea = document.getElementById('chat-area');

    // Function to handle sending messages
    window.sendMessage = function() {
        const message = messageInput.value.trim();
        if (message) {
            appendMessage(message, 'user-message');
            messageInput.value = '';
            fetchChatResponse(message);
        }
    };

    // Function to clear chat messages
    window.clearChat = function() {
        chatArea.innerHTML = '';
    };

    // Function to append messages to the chat area
    function appendMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        // Remove markdown-like symbols and convert to paragraphs
        const paragraphs = message.replace(/\*\*/g, '').split('\n').filter(p => p);
        paragraphs.forEach(paragraphText => {
            const paragraph = document.createElement('p');
            paragraph.textContent = paragraphText;
            messageDiv.appendChild(paragraph);
        });
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Function to fetch chat response from the server
    function fetchChatResponse(message) {
        // Simulate a sending message process
        const sendingIndicator = createSendingIndicator();
        chatArea.appendChild(sendingIndicator);

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Remove sending indicator
            chatArea.removeChild(sendingIndicator);
            appendMessage(data.response || 'Error in response', 'bot-message');
        })
        .catch(error => {
            console.error('Error:', error);
            chatArea.removeChild(sendingIndicator);
            appendMessage('Failed to get a response from the server', 'bot-message');
        });
    }

    // Create sending indicator element
    function createSendingIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = 'Sending...';
        indicator.classList.add('message', 'sending');
        return indicator;
    }

    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
