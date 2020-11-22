package de.paul2708.server.patch;

import com.google.gson.JsonObject;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.Broadcaster;
import de.paul2708.server.ws.message.MessageListener;
import io.javalin.websocket.WsContext;

public class PatchMessageListener implements MessageListener {

    private final UserRegistry userRegistry;
    private final Broadcaster broadcaster;

    public PatchMessageListener(UserRegistry userRegistry, Broadcaster broadcaster) {
        this.userRegistry = userRegistry;
        this.broadcaster = broadcaster;
    }

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