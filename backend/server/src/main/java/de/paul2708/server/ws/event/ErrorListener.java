package de.paul2708.server.ws.event;

import io.javalin.websocket.WsContext;
import io.javalin.websocket.WsErrorContext;

public class ErrorListener implements EventListener {

    @Override
    public void handle(WsContext context) throws Exception {
        // Nothing to do atm
        System.out.println("[WS] An error occurred.");

        if (context instanceof WsErrorContext) {
            WsErrorContext errorContext = (WsErrorContext) context;
            if (errorContext.error() == null) {
                return;
            }

            errorContext.error().printStackTrace();
        }
    }
}