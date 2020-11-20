package de.paul2708.server.ws.message;

import com.google.gson.*;
import io.javalin.websocket.WsMessageContext;
import io.javalin.websocket.WsMessageHandler;
import org.jetbrains.annotations.NotNull;

import java.util.List;

public class MessageProcessing implements WsMessageHandler {

    private final List<MessageListener> listeners;

    public MessageProcessing(List<MessageListener> listeners) {
        this.listeners = listeners;
    }

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
            } else {
                System.out.println("Message missing");
            }
        } catch (JsonParseException e) {
            // Invalid message
            System.out.println("Invalid message");
        }
    }
}
