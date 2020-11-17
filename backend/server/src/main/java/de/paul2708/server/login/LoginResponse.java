package de.paul2708.server.login;

import java.util.UUID;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class LoginResponse {

    private final UUID uuid;

    public LoginResponse(UUID uuid) {
        this.uuid = uuid;
    }

    public UUID getUuid() {
        return uuid;
    }
}
