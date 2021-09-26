package de.paul2708.server.patch;

import com.google.gson.JsonObject;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.Broadcaster;
import de.paul2708.server.ws.message.MessageListener;
import io.javalin.websocket.WsContext;

public record PatchMessageListener(UserRegistry userRegistry, Broadcaster broadcaster) implements MessageListener {

    @Override
    public String message() {
        return "patch";
    }

    @Override
    public void handle(WsContext ctx, JsonObject data) {
        data.addProperty("uid", userRegistry.findUser(ctx).get().getUuid().toString());

        broadcaster.broadcastToTeacher(data);
    }
}
