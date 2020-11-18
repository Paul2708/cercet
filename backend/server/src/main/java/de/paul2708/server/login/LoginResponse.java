package de.paul2708.server.login;

import de.paul2708.server.user.UserRole;

import java.util.UUID;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class LoginResponse {

    private final UUID uuid;
    private final UserRole role;

    public LoginResponse(UUID uuid, UserRole role) {
        this.uuid = uuid;
        this.role = role;
    }

    public UUID getUuid() {
        return uuid;
    }

    public UserRole getRole() {
        return role;
    }
}
