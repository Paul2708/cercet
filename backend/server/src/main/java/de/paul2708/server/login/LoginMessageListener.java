package de.paul2708.server.login;

import com.google.gson.JsonObject;
import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.Broadcaster;
import de.paul2708.server.ws.message.MessageListener;
import io.javalin.websocket.WsContext;

import java.util.UUID;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class LoginMessageListener implements MessageListener {

    private final UserRegistry userRegistry;
    private final Broadcaster broadcaster;

    public LoginMessageListener(UserRegistry userRegistry, Broadcaster broadcaster) {
        this.userRegistry = userRegistry;
        this.broadcaster = broadcaster;
    }

    @Override
    public String message() {
        return "login";
    }

    @Override
    public void handle(WsContext ctx, JsonObject data) {
        UUID uuid = UUID.fromString(data.get("uid").getAsString());
        User user = userRegistry.findUser(uuid).get();

        user.setSocket(ctx);
        ctx.send("Login done :D");

        // Broadcast users
        broadcaster.broadcastToTeacher(userRegistry.findAllStudents());
    }
}
