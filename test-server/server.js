const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});
wss.on('connection', ws => {
    ws.on('message', message => {
        console.log('received: %s', message);
    });

    setTimeout(() => {
        ws.send({
            "name": "Nico",
            "patch": "Index: Main.java\n===================================================================\n--- Main.java\n+++ Main.java\n@@ -1,1 +1,3 @@\n-public class Main {}\n\\ No newline at end of file\n+public class Main {\r\n+    \r\n+}\n\\ No newline at end of file\n"
        });
    }, 5000);
});
