package de.paul2708.server.user;

import io.javalin.websocket.WsContext;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class User {

    private final String name;
    private final UserRole role;

    private WsContext socket;

    public User(String name, UserRole role) {
        this.name = name;
        this.role = role;
    }

    public void setSocket(WsContext socket) {
        this.socket = socket;
    }

    public UserRole getRole() {
        return role;
    }

    public WsContext getSocket() {
        return socket;
    }
}
