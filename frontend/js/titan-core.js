// frontend/js/titan-core.js

// تهيئة WebSocket
let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    socket = new WebSocket(wsUrl);
    
    socket.onopen = function() {
        console.log('✅ WebSocket متصل');
        reconnectAttempts = 0;
        showNotification('متصل بالخادم', 'success');
    };
    
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };
    
    socket.onclose = function() {
        console.log('❌ WebSocket disconnected');
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(initWebSocket, 5000 * reconnectAttempts);
            showNotification('محاولة إعادة الاتصال...', 'warning');
        } else {
            showNotification('فشل الاتصال بالخادم', 'error');
        }
    };
}

function handleWebSocketMessage(data) {
    switch(data.type) {
        case 'chat':
            addChatMessage(data.content, 'ai');
            break;
        case 'training_update':
            updateTrainingStats(data.stats);
            break;
        case 'model_update':
            updateModelInfo(data.model);
            break;
        case 'alert':
            showNotification(data.message, data.level);
            break;
    }
}

// المحادثة
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    try {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'chat',
                content: message,
                timestamp: Date.now()
            }));
        } else {
            // API fallback
            const response = await callAPI('/v1/process', {
                query: message,
                session_id: getSessionId()
            });
            
            hideTypingIndicator();
            addChatMessage(response.result, 'ai');
        }
    } catch (error) {
        hideTypingIndicator();
        addChatMessage('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 'ai');
        console.error('Chat error:', error);
    }
}

function addChatMessage(text, sender) {
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

function setSuggestion(text) {
    document.getElementById('chatInput').value = text;
}

// الإدخال الصوتي
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('المتصفح لا يدعم الإدخال الصوتي', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        showNotification('جاري الاستماع...', 'info');
    };
    
    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        document.getElementById('chatInput').value = text;
        showNotification('تم التعرف على الصوت', 'success');
    };
    
    recognition.onerror = function(event) {
        showNotification('خطأ في التعرف على الصوت: ' + event.error, 'error');
    };
    
    recognition.start();
}

// تحديث الإحصائيات
async function updateStats() {
    try {
        const health = await callAPI('/health');
        
        document.getElementById('modelSize').textContent = health?.stats?.model_size || '2048';
        document.getElementById('parameters').textContent = health?.stats?.parameters || '7B';
        document.getElementById('accuracy').textContent = health?.stats?.accuracy || '99.9%';
        document.getElementById('uptime').textContent = formatUptime(health?.uptime_seconds) || '24/7';
        
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

function formatUptime(seconds) {
    if (!seconds) return '24/7';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    if (days > 0) {
        return `${days}d ${hours}h`;
    }
    return `${hours}h`;
}

// تحديث التدريب
async function updateTraining() {
    try {
        const stats = await callAPI('/training/stats');
        
        document.getElementById('trainingStatus').textContent = stats?.status || 'نشط';
        document.getElementById('trainingProgress').textContent = stats?.progress + '%' || '78%';
        document.getElementById('currentLoss').textContent = stats?.current_loss || '0.0234';
        document.getElementById('bestAccuracy').textContent = stats?.best_accuracy + '%' || '98.7%';
        document.getElementById('trainingTime').textContent = stats?.training_time || '47:23';
        
        // تحديث شريط التقدم
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = (stats?.progress || 78) + '%';
        }
        
        // إضافة سجل التدريب
        if (stats?.last_log) {
            addTrainingLog(stats.last_log);
        }
        
    } catch (error) {
        console.error('Failed to update training:', error);
    }
}

function addTrainingLog(log) {
    const logsContainer = document.getElementById('trainingLogs');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${log.level || 'info'}`;
    logEntry.textContent = log.message;
    
    logsContainer.appendChild(logEntry);
    
    // التمرير لأسفل
    logsContainer.scrollTop = logsContainer.scrollHeight;
    
    // الاحتفاظ بآخر 100 سجل فقط
    while (logsContainer.children.length > 100) {
        logsContainer.removeChild(logsContainer.firstChild);
    }
}

// النماذج
async function switchModel(modelName) {
    try {
        const result = await callAPI('/models/switch', {
            method: 'POST',
            body: JSON.stringify({ model: modelName })
        });
        
        if (result.success) {
            showNotification(`تم التبديل إلى ${modelName}`, 'success');
            
            // تحديث الواجهة
            document.querySelectorAll('.model-card').forEach(card => {
                card.classList.remove('active');
            });
            
            event.target.closest('.model-card').classList.add('active');
        }
    } catch (error) {
        showNotification('فشل تبديل النموذج', 'error');
    }
}

// المصادقة
function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // TODO: تبديل النموذج حسب التبويب
}

async function handleLogin(event) {
    event.preventDefault();
    
    try {
        const result = await callAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: document.querySelector('#loginForm input[type="text"]').value,
                password: document.querySelector('#loginForm input[type="password"]').value,
                mfa: document.querySelector('#loginForm input[placeholder*="MFA"]').value
            })
        });
        
        if (result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('session_id', result.session_id);
            hideLoginModal();
            showNotification('تم تسجيل الدخول بنجاح', 'success');
        }
    } catch (error) {
        showNotification('فشل تسجيل الدخول', 'error');
    }
}

// مولد الأكواد
function openCodeGenerator() {
    // TODO: فتح مولد الأكواد المتقدم
    showNotification('سيتم فتح مولد الأكواد قريباً', 'info');
}

// الإشعارات
function showNotification(message, level = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${level}`;
    notification.innerHTML = `
        <i class="fas ${getIconForLevel(level)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // إخفاء بعد 3 ثوان
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getIconForLevel(level) {
    switch(level) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// استدعاء API
async function callAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('session_id');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(sessionId && { 'X-Session-ID': sessionId })
    };
    
    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// إدارة الجلسة
function getSessionId() {
    return localStorage.getItem('session_id') || generateSessionId();
}

function generateSessionId() {
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
    return sessionId;
}

// تبديل الثيم
function toggleTheme() {
    // TODO: تنفيذ تبديل الثيم
    showNotification('سيتم إضافة الوضع الليلي قريباً', 'info');
}

// خلفية ثلاثية الأبعاد
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // إنشاء جزيئات متحركة
    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
        // موقع عشوائي في كرة
        const r = 20 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);
        
        // ألوان متدرجة
        colors[i] = 0.4 + Math.random() * 0.3; // R
        colors[i + 1] = 0.2 + Math.random() * 0.3; // G
        colors[i + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    // حلقة الرسوم المتحركة
    function animate() {
        requestAnimationFrame(animate);
        
        points.rotation.x += 0.0001;
        points.rotation.y += 0.0002;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // تحديث الحجم عند تغيير النافذة
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إظهار شريط التحميل
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.style.width = '30%';
    
    setTimeout(() => {
        loadingBar.style.width = '70%';
    }, 500);
    
    setTimeout(() => {
        loadingBar.style.width = '100%';
        setTimeout(() => {
            loadingBar.style.opacity = '0';
        }, 500);
    }, 1500);
    
    // بدء WebSocket
    initWebSocket();
    
    // تحديث الإحصائيات
    updateStats();
    setInterval(updateStats, 30000);
    
    // تحديث التدريب
    updateTraining();
    setInterval(updateTraining, 2000);
    
    // تأثير التمرير على شريط التنقل
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
