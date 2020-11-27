package de.paul2708.server.login;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

import java.util.Map;
import java.util.UUID;

public class LoginEndpoint implements Handler {

    private final UserRegistry userRegistry;
    private final Map<String, String> teacherMapping;

    public LoginEndpoint(UserRegistry userRegistry, Map<String, String> teacherMapping) {
        this.userRegistry = userRegistry;
        this.teacherMapping = teacherMapping;
    }

    @Override
    public void handle(@NotNull Context context) {
        LoginRequest information = context.bodyValidator(LoginRequest.class).getOrNull();

        User user;
        if (teacherMapping.containsKey(information.getName())) {
            user = new User(teacherMapping.get(information.getName()), UserRole.TEACHER);
        } else {
            user = new User(information.getName(), UserRole.STUDENT);
        }

        UUID uuid = userRegistry.register(user);

        context.json(new LoginResponse(uuid, user.getRole()));

        System.out.println(information);
    }
}