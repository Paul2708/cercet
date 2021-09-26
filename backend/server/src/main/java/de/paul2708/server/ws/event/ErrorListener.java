package de.paul2708.server.ws.event;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import io.javalin.websocket.WsContext;
import io.javalin.websocket.WsErrorContext;
import org.eclipse.jetty.websocket.api.CloseException;
import org.slf4j.Logger;

import java.util.Optional;

public record ErrorListener(UserRegistry userRegistry, Logger logger) implements EventListener {

    @Override
    public void handle(WsContext context) throws Exception {
        WsErrorContext errorContext = (WsErrorContext) context;

        // Ignore anonymous socket timeout
        if (errorContext.error() instanceof CloseException) {
            if (userRegistry.findUser(context).isEmpty()) {
                return;
            }
        }

        // Log errors
        Optional<User> userOpt = userRegistry.findUser(context);
        String user = "anonymous";
        if (userOpt.isPresent()) {
            user = userOpt.get().getName();
        }

        logger.error(String.format("An error occurred at %s", user), errorContext.error());
    }
}
