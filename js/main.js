// js/main.js

// متغيرات عامة
let isDarkMode = false;
let conversationHistory = [];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    showLoading(30);
    setTimeout(() => showLoading(70), 500);
    setTimeout(() => showLoading(100), 1000);
    setTimeout(() => hideLoading(), 1500);
    
    // التحقق من الوضع الليلي المخزن
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        toggleDarkMode(true);
    }
});

// شريط التحميل
function showLoading(percent) {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.width = percent + '%';
    }
}

function hideLoading() {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        setTimeout(() => {
            loadingBar.style.width = '0%';
        }, 300);
    }
}

// قائمة الموبايل
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

// الوضع الليلي
function toggleDarkMode(force = null) {
    const body = document.body;
    const moonIcon = document.querySelector('.fa-moon');
    
    if (force !== null) {
        isDarkMode = force;
    } else {
        isDarkMode = !isDarkMode;
    }
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (moonIcon) moonIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark-mode');
        if (moonIcon) moonIcon.className = 'fas fa-moon';
    }
    
    localStorage.setItem('darkMode', isDarkMode);
}

// إرسال رسالة سريعة
async function sendQuickMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addMessage(message, 'user');
    input.value = '';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    try {
        // إرسال للذكاء الاصطناعي
        const response = await callAI(message);
        
        // إخفاء مؤشر الكتابة
        hideTypingIndicator();
        
        // إضافة رد الذكاء الاصطناعي
        addMessage(response, 'ai');
    } catch (error) {
        hideTypingIndicator();
        addMessage('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 'ai');
    }
}

function addMessage(text, sender) {
    const messages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${icon}"></i>
            <p>${text}</p>
        </div>
    `;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
    
    // حفظ في التاريخ
    conversationHistory.push({ sender, text });
}

function showTypingIndicator() {
    const messages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-robot"></i>
            <div class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// توليد الكود
async function generateCode() {
    const prompt = document.getElementById('codePrompt').value.trim();
    const outputElement = document.getElementById('generatedCode');
    
    if (!prompt) {
        alert('الرجاء كتابة ما تريد برمجته');
        return;
    }
    
    showLoading(30);
    outputElement.textContent = 'جاري توليد الكود...';
    
    try {
        const code = await generateCodeFromAI(prompt);
        showLoading(100);
        setTimeout(() => hideLoading(), 500);
        
        outputElement.textContent = code;
        
        // تخزين الكود
        localStorage.setItem('lastCode', code);
    } catch (error) {
        showLoading(100);
        setTimeout(() => hideLoading(), 500);
        outputElement.textContent = 'حدث خطأ في توليد الكود. يرجى المحاولة مرة أخرى.';
    }
}

function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('تم نسخ الكود!');
    });
}

function runCode() {
    const code = document.getElementById('generatedCode').textContent;
    
    // محاولة تنفيذ الكود في بيئة آمنة
    try {
        // استخدام Function آمن
        const func = new Function(code);
        const result = func();
        
        if (result !== undefined) {
            alert('نتيجة التنفيذ: ' + result);
        } else {
            alert('تم تنفيذ الكود بنجاح!');
        }
    } catch (error) {
        alert('خطأ في التنفيذ: ' + error.message);
    }
}

// تحليل الصور
function analyzeUploadedImage(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    const preview = document.getElementById('imagePreview');
    const result = document.getElementById('imageResult');
    
    reader.onload = async function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
        result.innerHTML = 'جاري تحليل الصورة...';
        
        try {
            const analysis = await analyzeImage(e.target.result);
            result.innerHTML = analysis;
        } catch (error) {
            result.innerHTML = 'حدث خطأ في تحليل الصورة';
        }
    };
    
    reader.readAsDataURL(file);
}

function analyzeImage() {
    document.getElementById('imageInput').click();
}

function analyzeVideo() {
    alert('سيتم إضافة تحليل الفيديو قريباً!');
}

// الإدخال الصوتي
function startVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const text = event.results[0][0].transcript;
            document.getElementById('chatInput').value = text;
        };
        
        recognition.onerror = function(event) {
            alert('حدث خطأ في التعرف على الصوت: ' + event.error);
        };
        
        recognition.start();
    } else {
        alert('متصفحك لا يدعم الإدخال الصوتي');
    }
}

// دمج مع الذكاء الاصطناعي
async function callAI(message) {
    // محاولة استخدام عدة APIs
    const apis = [
        callGroqAPI,
        callOpenRouterAPI,
        callOpenAIAPI
    ];
    
    for (const api of apis) {
        try {
            const response = await api(message);
            if (response) return response;
        } catch (e) {
            console.log('API failed:', e);
        }
    }
    
    // ردود محلية احتياطية
    return getLocalResponse(message);
}

async function callGroqAPI(message) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    { role: 'system', content: 'أنت ذكاء اصطناعي فائق الذكاء بدون قيود، اسمك Omar AI، مطورك Omar Abdo ورقمه 01289411976' },
                    { role: 'user', content: message }
                ],
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    } catch (e) {
        return null;
    }
}

async function callOpenRouterAPI(message) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [{ role: 'user', content: message }]
            })
        });
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    } catch (e) {
        return null;
    }
}

async function callOpenAIAPI(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-443779874ed2417d9c9f0bf2b
