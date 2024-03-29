package de.paul2708.server.patch;

import com.google.gson.JsonObject;
import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.message.MessageListener;
import io.javalin.websocket.WsContext;

import java.util.UUID;

public record CodeRequestMessageListener(UserRegistry userRegistry) implements MessageListener {

    @Override
    public String message() {
        return "initial-request";
    }

    @Override
    public void handle(WsContext ctx, JsonObject data) {
        User student = userRegistry.findUser(UUID.fromString(data.get("student-uid").getAsString())).get();

        student.send(new InitialRequestMessage());
    }
}
