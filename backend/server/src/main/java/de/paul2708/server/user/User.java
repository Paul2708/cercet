package de.paul2708.server.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.javalin.websocket.WsContext;

import java.util.UUID;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class User {

    private UUID uuid;

    private final String name;
    private final UserRole role;

    @JsonIgnore
    private WsContext socket;

    public User(String name, UserRole role) {
        this.name = name;
        this.role = role;
    }

    public boolean hasSameSocket(WsContext context) {
        return socket.getSessionId().equals(context.getSessionId());
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public void setSocket(WsContext socket) {
        this.socket = socket;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getName() {
        return name;
    }

    public UserRole getRole() {
        return role;
    }

    public WsContext getSocket() {
        return socket;
    }
}
