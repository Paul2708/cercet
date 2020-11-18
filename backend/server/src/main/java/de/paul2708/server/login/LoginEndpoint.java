package de.paul2708.server.login;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;

public class LoginEndpoint implements Handler {

    private final UserRegistry userRegistry;

    public LoginEndpoint(UserRegistry userRegistry) {
        this.userRegistry = userRegistry;
    }

    @Override
    public void handle(@NotNull Context context) {
        LoginRequest information = context.bodyValidator(LoginRequest.class).getOrNull();

        UserRole role = information.getName().equals("Paul Hoger") ? UserRole.TEACHER : UserRole.STUDENT;
        User user = new User(information.getName(), role);

        UUID uuid = userRegistry.register(user);

        context.json(new LoginResponse(uuid, user.getRole()));

        System.out.println(information);
    }
}