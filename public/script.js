const socket = io();

const generateBtn = document.getElementById('generate-btn');
const apiKeyDisplay = document.getElementById('api-key-display');
const snippetDisplay = document.getElementById('snippet-display');
const authKeyInput = document.getElementById('auth-key-input');
const connectBtn = document.getElementById('connect-btn');
const sendBtn = document.getElementById('send-btn');
const payloadInput = document.getElementById('payload-input');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const logOutput = document.getElementById('log-output');

let currentApiKey = '';

function logMessage(msg) {
    const time = new Date().toLocaleTimeString();
    logOutput.innerHTML += `[${time}] ${msg}<br>`;
    logOutput.scrollTop = logOutput.scrollHeight;
}

generateBtn.addEventListener('click', async () => {
    try {
        logMessage('Requesting new API key...');
        const response = await fetch('/api/generate-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        if (data.success) {
            currentApiKey = data.apiKey;
            apiKeyDisplay.textContent = currentApiKey;
            authKeyInput.value = currentApiKey;
            
            // Generate customized snippet for their websites
            const origin = window.location.origin;
            snippetDisplay.textContent = `<script src="${origin}/socket.io/socket.io.js"></script>\n<script src="${origin}/peebaz-client.js"></script>\n<script>\n  const sync = new PeebazSync('${currentApiKey}', '${origin}');\n  sync.onData(data => console.log('Live data:', data));\n  // sync.send('Hello from website!');\n</script>`;
            
            logMessage('API Key & integration snippet generated.');
        } else {
            logMessage('Failed to generate key.');
        }
    } catch (err) {
        logMessage('Error connecting to server for key generation.');
    }
});

connectBtn.addEventListener('click', () => {
    const keyToAuth = authKeyInput.value.trim();
    if (!keyToAuth) {
        alert('Please enter or generate an API key first.');
        return;
    }
    logMessage('Authenticating with key...');
    socket.emit('authenticate', { apiKey: keyToAuth });
});

sendBtn.addEventListener('click', () => {
    const payload = payloadInput.value.trim();
    const keyToAuth = authKeyInput.value.trim();
    if (!payload || !keyToAuth) {
        alert('API Key and payload message cannot be empty.');
        return;
    }
    socket.emit('data-sync', { apiKey: keyToAuth, payload });
    logMessage(`Sent payload: ${payload}`);
    payloadInput.value = '';
});

socket.on('auth-success', (data) => {
    statusDot.classList.add('connected');
    statusText.textContent = 'Connected & Synced';
    logMessage(data.message);
});

socket.on('auth-error', (data) => {
    statusDot.classList.remove('connected');
    statusText.textContent = 'Auth Failed';
    logMessage(`Error: ${data.message}`);
});

socket.on('live-data', (payload) => {
    logMessage(`📥 Received Live Data: ${payload}`);
});
