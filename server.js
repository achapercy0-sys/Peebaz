const express = require('express');
<<<<<<< HEAD
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
=======
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
>>>>>>> 03f7e34ed6ef9e42d92aeb94523d22c27913d1e5

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<< HEAD
let sharedDataStore = {
    message: "Hello from Peebaz Console!",
    lastUpdated: new Date().toISOString()
};

app.post('/api/generate-key', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required to generate API key.' });
    }
    
    const randomHash = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const apiKey = `pk_live_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${randomHash}`;
    
    res.json({
        success: true,
        apiKey: apiKey,
        created: new Date().toISOString(),
        status: 'active'
    });
});

app.get('/api/v1/data', (req, res) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey || !apiKey.startsWith('pk_live_')) {
        return res.status(401).json({ error: 'Unauthorized: Valid API key required in headers (x-api-key) or query parameters.' });
    }

    res.json({
        success: true,
        source: "Peebaz",
        data: sharedDataStore
    });
});

app.post('/api/v1/data', (req, res) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey || !apiKey.startsWith('pk_live_')) {
        return res.status(401).json({ error: 'Unauthorized: Valid API key required.' });
    }

    const { message } = req.body;
    if (message) {
        sharedDataStore.message = message;
        sharedDataStore.lastUpdated = new Date().toISOString();
    }

    res.json({
        success: true,
        message: "Data successfully synchronized across webs!",
        updatedData: sharedDataStore
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
=======
app.post('/api/generate-key', (req, res) => {
    try {
        const apiKey = 'pb_' + crypto.randomBytes(16).toString('hex');
        res.json({ success: true, apiKey });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('authenticate', (data) => {
        const { apiKey } = data;
        if (apiKey && apiKey.startsWith('pb_')) {
            socket.join(apiKey);
            socket.emit('auth-success', { message: `Successfully joined room: ${apiKey}` });
        } else {
            socket.emit('auth-error', { message: 'Invalid API Key format' });
        }
    });

    socket.on('data-sync', (data) => {
        const { apiKey, payload } = data;
        if (apiKey && payload) {
            io.to(apiKey).emit('live-data', payload);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Peebaz server running on http://0.0.0.0:${PORT}`);
>>>>>>> 03f7e34ed6ef9e42d92aeb94523d22c27913d1e5
});
