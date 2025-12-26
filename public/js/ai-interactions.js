// Simple form enhancement
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('aiForm');
    const input = document.getElementById('questionInput');
    const sendButton = document.getElementById('sendButton');
    const messagesArea = document.getElementById('messagesArea');

    // Focus input on load
    input.focus();

    // Handle Enter key
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.value.trim()) {
                form.submit();
            }
        }
    });

    // Add user message before form submission
    form.addEventListener('submit', function(e) {
        const question = input.value.trim();
        if (question) {
            // Add user message to UI
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerHTML = `
                <div class="message-avatar">👤</div>
                <div class="message-bubble user-bubble">
                    <p>${escapeHtml(question)}</p>
                </div>
            `;
            messagesArea.appendChild(userMessage);

            // Add loading message
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'message bot-message loading-message';
            loadingMessage.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-bubble bot-bubble">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            messagesArea.appendChild(loadingMessage);

            // Scroll to bottom
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    });

    // Scroll to bottom on load if there's an answer
    if (messagesArea.scrollHeight > messagesArea.clientHeight) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});