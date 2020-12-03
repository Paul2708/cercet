package de.paul2708.server.ws;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;

import java.util.function.Predicate;

public class Broadcaster {

    private final UserRegistry registry;

    public Broadcaster(UserRegistry registry) {
        this.registry = registry;
    }

    public void broadcastToTeacher(Object object) {
        broadcastTo(object, user -> user.getRole() == UserRole.TEACHER);
    }

    public void broadcastToStudents(Object object) {
        broadcastTo(object, user -> user.getRole() == UserRole.STUDENT);
    }

    public void broadcastToEveryone(Object object) {
        broadcastTo(object, user -> true);
    }

    public void broadcastTo(Object object, Predicate<User> predicate) {
        registry.findAllUsers().stream()
                .filter(predicate)
                .forEach(user -> {
                    user.send(object);
                });
    }
}
