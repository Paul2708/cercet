const WebSocket = require('ws');

const patches = require('./patches.json');

const wss = new WebSocket.Server({port: 8080});
wss.on('connection', ws => {
    ws.on('message', message => {
        console.log('received: %s', message);
    });

    setTimeout(() => {
        const patch = patches[Math.floor(Math.random() * patches.length)];
        ws.send(JSON.stringify(patch));
    }, 5000);
});
