class PeebazSync {
    constructor(apiKey, serverUrl = window.location.origin) {
        this.apiKey = apiKey;
        this.socket = io(serverUrl);
        
        this.socket.on('connect', () => {
            this.socket.emit('authenticate', { apiKey: this.apiKey });
        });
    }

    send(payload) {
        this.socket.emit('data-sync', { apiKey: this.apiKey, payload });
    }

    onData(callback) {
        this.socket.on('live-data', callback);
    }
}
