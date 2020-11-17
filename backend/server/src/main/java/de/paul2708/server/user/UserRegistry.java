package de.paul2708.server.user;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class UserRegistry {

    private final Map<UUID, User> users;

    public UserRegistry() {
        this.users = new HashMap<>();
    }

    public Optional<User> findUser(UUID uid) {
        return users.containsKey(uid) ? Optional.of(users.get(uid)) : Optional.empty();
    }

    public UUID register(User user) {
        UUID uuid = UUID.randomUUID();

        users.put(uuid, user);

        return uuid;
    }
}
