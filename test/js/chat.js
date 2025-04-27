// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing chat...');
    
    // 获取 DOM 元素
    const chatBody = document.getElementById('chat-body');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatToggle = document.getElementById('chat-toggle');
    
    // 检查元素是否存在
    if (!chatBody || !messageInput || !sendButton || !chatToggle) {
        console.error('Chat elements not found');
        return;
    }
    
    console.log('Chat elements found');
    
    // AI 回复
    const aiResponses = {
        greeting: [
            "你好！很高兴见到你。",
            "嗨！今天过得怎么样？"
        ],
        upload: [
            "你可以点击'选择图片'按钮来上传图片。",
            "支持上传多张图片，格式包括 JPG、PNG 等。",
            "上传的图片会立即显示在画廊中。"
        ],
        default: [
            "我明白了，请继续说。",
            "有趣的观点，能详细说说吗？",
            "我理解你的意思，还有什么我可以帮你的吗？"
        ]
    };
    
    // 获取随机回复
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // 获取 AI 回复
    function getAIResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('你好') || message.includes('嗨') || message.includes('hi')) {
            return getRandomResponse(aiResponses.greeting);
        }
        
        if (message.includes('上传') || message.includes('图片') || message.includes('怎么')) {
            return getRandomResponse(aiResponses.upload);
        }
        
        return getRandomResponse(aiResponses.default);
    }
    
    // 添加消息到聊天窗口
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // 发送消息
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        console.log('Sending message:', message);
        
        // 添加用户消息
        addMessage(message, 'user');
        messageInput.value = '';
        
        // 获取并添加 AI 回复
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessage(response, 'ai');
        }, 500);
    }
    
    // 绑定事件
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    chatToggle.addEventListener('click', function() {
        chatBody.classList.toggle('active');
        chatToggle.textContent = chatBody.classList.contains('active') ? '▼' : '▲';
    });
    
    // 设置初始状态
    chatBody.classList.add('active');
    chatToggle.textContent = '▼';
    
    // 添加欢迎消息
    addMessage("你好！我是你的AI助手。", 'ai');
    
    console.log('Chat initialized successfully');
}); 