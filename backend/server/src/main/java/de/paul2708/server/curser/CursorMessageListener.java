package de.paul2708.server.curser;

import com.google.gson.JsonObject;
import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.Broadcaster;
import de.paul2708.server.ws.message.MessageListener;
import io.javalin.websocket.WsContext;

import java.util.Optional;
import java.util.UUID;

public class CursorMessageListener implements MessageListener {

    private final UserRegistry userRegistry;

    public CursorMessageListener(UserRegistry userRegistry) {
        this.userRegistry = userRegistry;
    }

    @Override
    public String message() {
        return "cursor";
    }

    @Override
    public void handle(WsContext ctx, JsonObject data) {
        Optional<User> userOpt = userRegistry.findUser(UUID.fromString(data.get("student-uid").getAsString()));
        if (userOpt.isEmpty()) {
            return;
        }

        data.addProperty("teacher-uid", userRegistry.findUser(ctx).get().getUuid().toString());

        userOpt.get().send(data);
    }
}