package de.paul2708.server.ws.message;

import com.google.gson.*;
import io.javalin.websocket.WsMessageContext;
import io.javalin.websocket.WsMessageHandler;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;

import java.util.List;

public record MessageProcessing(List<MessageListener> listeners, Logger logger) implements WsMessageHandler {

    @Override
    public void handleMessage(@NotNull WsMessageContext ctx) {
        try {
            JsonObject message = JsonParser.parseString(ctx.message()).getAsJsonObject();

            if (message.has("message") && message.has("data")) {
                String messageType = message.get("message").getAsString();

                for (MessageListener listener : listeners) {
                    if (listener.message().equals(messageType)) {
                        listener.handle(ctx, message.getAsJsonObject("data"));
                    }
                }
            }
        } catch (JsonParseException e) {
            // Invalid message
            logger.error("Received invalid message.");
        }
    }
}
