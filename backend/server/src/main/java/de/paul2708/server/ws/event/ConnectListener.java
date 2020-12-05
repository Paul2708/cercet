package de.paul2708.server.ws.event;

import io.javalin.websocket.WsConnectContext;
import io.javalin.websocket.WsContext;

public class ConnectListener implements EventListener {

    @Override
    public void handle(WsContext context) throws Exception {
        WsConnectContext connectContext = (WsConnectContext) context;

        // Nothing to do atm.
        // The actual registration is defined in login message listener.
    }
}