package de.paul2708.server.user;

import java.util.*;
import java.util.stream.Collectors;

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
        user.setUuid(uuid);

        return uuid;
    }

    public List<User> findAllStudents() {
        return users.values().stream()
                .filter(user -> user.getRole() == UserRole.STUDENT)
                .collect(Collectors.toList());
    }
}
