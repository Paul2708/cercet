package de.paul2708.server.ws.event;

import io.javalin.websocket.WsContext;

public interface EventListener {

    void handle(WsContext context) throws Exception;
}