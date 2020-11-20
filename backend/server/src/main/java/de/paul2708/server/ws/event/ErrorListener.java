package de.paul2708.server.ws.event;

import io.javalin.websocket.WsContext;

public class ErrorListener implements EventListener {

    @Override
    public void handle(WsContext context) throws Exception {
        // Nothing to do atm
        System.out.println("[WS] An error occurred.");
    }
}