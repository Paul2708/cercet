package de.paul2708.server.login;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;

import java.util.Map;
import java.util.UUID;

public class LoginEndpoint implements Handler {

    private final UserRegistry userRegistry;
    private final Map<String, String> teacherMapping;
    private final Logger logger;

    public LoginEndpoint(UserRegistry userRegistry, Map<String, String> teacherMapping, Logger logger) {
        this.userRegistry = userRegistry;
        this.teacherMapping = teacherMapping;
        this.logger = logger;
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

        logger.info(String.format("New user login: %s as %s", user.getName(), user.getRole().name().toLowerCase()));
    }
}