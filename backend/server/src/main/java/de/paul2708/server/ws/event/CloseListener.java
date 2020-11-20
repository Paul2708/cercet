package de.paul2708.server.ws.event;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.Broadcaster;
import io.javalin.websocket.WsContext;

import java.util.Optional;

public class CloseListener implements EventListener {

    private final UserRegistry userRegistry;
    private final Broadcaster broadcaster;

    public CloseListener(UserRegistry userRegistry, Broadcaster broadcaster) {
        this.userRegistry = userRegistry;
        this.broadcaster = broadcaster;
    }

    @Override
    public void handle(WsContext context) throws Exception {
        Optional<User> userOpt = userRegistry.findUser(context);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            System.out.println(user.getName() + " closed connection.");

            userRegistry.unregister(user.getUuid());

            // Broadcast users
            broadcaster.broadcastToTeacher(userRegistry.findAllStudents());
        } else {
            System.out.println("Anonymous socket closed connection.");
        }
    }
}
