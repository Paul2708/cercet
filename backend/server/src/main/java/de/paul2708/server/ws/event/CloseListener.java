package de.paul2708.server.ws.event;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import io.javalin.websocket.WsContext;

import java.util.Optional;

public class CloseListener implements EventListener {

    private final UserRegistry userRegistry;

    public CloseListener(UserRegistry userRegistry) {
        this.userRegistry = userRegistry;
    }

    @Override
    public void handle(WsContext context) throws Exception {
        Optional<User> userOpt = userRegistry.findUser(context);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            System.out.println(user.getName() + " closed connection.");

            userRegistry.unregister(user.getUuid());
        } else {
            System.out.println("Anonymous socket closed connection.");
        }
    }
}
