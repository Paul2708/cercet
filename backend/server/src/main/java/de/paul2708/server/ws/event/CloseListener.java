package de.paul2708.server.ws.event;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.ws.Broadcaster;
import io.javalin.websocket.WsCloseContext;
import io.javalin.websocket.WsContext;
import org.slf4j.Logger;

import java.util.Optional;

public record CloseListener(UserRegistry userRegistry, Broadcaster broadcaster, Logger logger) implements EventListener {

    @Override
    public void handle(WsContext context) throws Exception {
        WsCloseContext closeContext = (WsCloseContext) context;

        Optional<User> userOpt = userRegistry.findUser(context);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            userRegistry.unregister(user.getUuid());

            logger.info(String.format("%s closed connection. (status=%d, reason=%s)", user.getName(), closeContext.status(), closeContext.reason()));

            // Broadcast users
            broadcaster.broadcastToTeacher(userRegistry.findAllStudents());
        }
    }
}
