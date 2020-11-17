package de.paul2708.server.ws;

import com.google.gson.JsonObject;
import io.javalin.websocket.WsContext;

public interface MessageListener {

    String message();

    void handle(WsContext ctx, JsonObject data);
}
