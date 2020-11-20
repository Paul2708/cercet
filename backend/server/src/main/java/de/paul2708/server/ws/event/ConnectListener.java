package de.paul2708.server.ws.event;

import io.javalin.websocket.WsContext;
import org.w3c.dom.events.Event;

public class ConnectListener implements EventListener {

    @Override
    public void handle(WsContext context) throws Exception {
        // Nothing to do atm.
        // The actual registration is defined in login message listener.
    }
}